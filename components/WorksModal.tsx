'use client';

interface WorksModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WorksModal({ isOpen, onClose }: WorksModalProps) {
    if (!isOpen) return null;

    // Fungsi handle close biar bisa nerima klik mouse atau sentuhan jari
    const handleClose = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        onClose();
    };

    return (
        <div className="modal show" onClick={onClose} onTouchStart={onClose}>
            <div 
                className="modal-content sys-text" 
                onClick={(e) => e.stopPropagation()} 
                onTouchStart={(e) => e.stopPropagation()} 
            >
                <pre>+-----------------------------------------+</pre>
                <pre>| SYSTEM_MSG: UNDER_CONSTRUCTION          |</pre>
                <pre>+-----------------------------------------+</pre>
                <div className="modal-text">
                    <p>{">"} please wait. the [works] directory is currently being compiled.</p>
                    <p>{">"} however, agst is currently open for commissioned work and collaborations.</p>
                    <p>{">"} let's build something unusual. specializing in raw, brutalist, and highly experimental visual projects.</p>
                </div>
                <a 
                    href="#" 
                    onClick={handleClose}
                    onTouchStart={handleClose}
                >
                    {">>"} close_prompt
                </a>
            </div>
        </div>
    );
}