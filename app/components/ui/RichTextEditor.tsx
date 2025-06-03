'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './quill.module.css';

// Import React Quill dynamically with no SSR
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link'
];

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = 'Start typing...', 
  className = '' 
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [editorFailed, setEditorFailed] = useState(false);
  const [key, setKey] = useState(0);

  // Wait until component is mounted to render Quill
  useEffect(() => {
    setMounted(true);
    
    // Add a small delay before re-rendering to ensure proper initialization
    const timer = setTimeout(() => {
      setKey(prev => prev + 1);
    }, 100);
    
    // Set a timeout to detect if editor fails to load properly
    const failureTimer = setTimeout(() => {
      if (document.querySelector('.ql-editor') === null) {
        console.log('React Quill failed to initialize properly, using fallback editor');
        setEditorFailed(true);
      }
    }, 2000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(failureTimer);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="border border-slate-300 rounded-md p-4 min-h-[200px] bg-white">
        Loading editor...
      </div>
    );
  }

  // Fallback to textarea if React Quill fails
  if (editorFailed) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full p-4 min-h-[200px] border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      />
    );
  }

  return (
    <div className={styles.quillWrapper} key={key}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className={className}
      />
    </div>
  );
} 