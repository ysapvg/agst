'use client';

import { useEffect, useRef } from 'react';

interface Point3D {
    x: number;
    y: number;
    z: number;
}

export default function DotGlobe() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        // Generate points on a 3D sphere using Fibonacci spiral
        const numPoints = 500;
        const points: Point3D[] = [];
        const phi = Math.PI * (Math.sqrt(5) - 1); // Golden ratio angle

        for (let i = 0; i < numPoints; i++) {
            const y = 1 - (i / (numPoints - 1)) * 2; // y from 1 to -1
            const radiusAtY = Math.sqrt(1 - y * y);
            const theta = phi * i;

            const x = Math.cos(theta) * radiusAtY;
            const z = Math.sin(theta) * radiusAtY;

            points.push({ x, y, z });
        }

        let angleY = 0;
        const tiltX = 0.25; // slight tilt

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            const sphereRadius = Math.min(width, height) * 0.42;
            const centerX = width / 2;
            const centerY = height / 2;

            angleY += 0.0035;

            const cosY = Math.cos(angleY);
            const sinY = Math.sin(angleY);
            const cosX = Math.cos(tiltX);
            const sinX = Math.sin(tiltX);

            for (let i = 0; i < points.length; i++) {
                const pt = points[i];

                // Rotation around Y axis
                const x1 = pt.x * cosY - pt.z * sinY;
                const z1 = pt.z * cosY + pt.x * sinY;

                // Rotation around X axis (tilt)
                const y1 = pt.y * cosX - z1 * sinX;
                const z2 = z1 * cosX + pt.y * sinX;

                // Perspective projection
                const fov = 3.5;
                const scale = fov / (fov + z2);

                const projX = centerX + x1 * sphereRadius * scale;
                const projY = centerY + y1 * sphereRadius * scale;

                // Depth-based opacity & radius
                const alpha = Math.max(0.1, (z2 + 1) / 2);
                const dotRadius = Math.max(0.6, (z2 + 1.2) * 1.5 * scale);

                ctx.beginPath();
                ctx.arc(projX, projY, dotRadius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.9})`;
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas id="dotGlobe" ref={canvasRef} />;
}
