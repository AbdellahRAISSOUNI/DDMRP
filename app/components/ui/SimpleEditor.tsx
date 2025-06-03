'use client';

import { useState, useRef } from 'react';

interface SimpleEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SimpleEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  className = ''
}: SimpleEditorProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const insertFormat = (startTag: string, endTag: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newValue = 
      value.substring(0, start) + 
      startTag + 
      selectedText + 
      endTag + 
      value.substring(end);
    
    onChange(newValue);
    
    // Set cursor position after operation
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + startTag.length,
        start + startTag.length + selectedText.length
      );
    }, 0);
  };
  
  const formatButtons = [
    { label: 'Bold', action: () => insertFormat('<strong>', '</strong>') },
    { label: 'Italic', action: () => insertFormat('<em>', '</em>') },
    { label: 'Underline', action: () => insertFormat('<u>', '</u>') },
    { label: 'H2', action: () => insertFormat('<h2>', '</h2>') },
    { label: 'H3', action: () => insertFormat('<h3>', '</h3>') },
    { label: 'Link', action: () => insertFormat('<a href="#">', '</a>') },
    { label: 'List', action: () => insertFormat('<ul>\n  <li>', '</li>\n</ul>') },
    { label: 'Paragraph', action: () => insertFormat('<p>', '</p>') },
  ];
  
  // Process content for preview - convert newlines to <br> tags
  const processContentForPreview = (content: string) => {
    // First wrap content in <p> tags if it doesn't already have block elements
    if (!content.includes('<p>') && !content.includes('<h') && !content.includes('<ul>')) {
      // Split by newlines and wrap each paragraph in <p> tags
      return content.split('\n')
        .filter(line => line.trim() !== '')
        .map(line => `<p>${line}</p>`)
        .join('');
    }
    return content;
  };
  
  return (
    <div className="editor-container">
      <div className="toolbar bg-slate-100 border border-slate-300 p-2 rounded-t-md">
        <div className="flex flex-wrap gap-2">
          {formatButtons.map((button) => (
            <button 
              key={button.label}
              type="button"
              onClick={button.action}
              className="px-2 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50"
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full p-4 min-h-[200px] border border-slate-300 border-t-0 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isFocused ? 'ring-2 ring-blue-500' : ''
        } ${className}`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {value && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-slate-700 mb-2">Preview:</h4>
          <div 
            className="p-4 border border-slate-200 rounded-md bg-white prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: processContentForPreview(value) }}
          />
        </div>
      )}
    </div>
  );
} 