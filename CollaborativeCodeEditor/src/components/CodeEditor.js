import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, language, onChange, users }) => {
  const editorRef = useRef(null);
  const decorationsRef = useRef([]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      minimap: { enabled: true },
      wordWrap: 'on',
      automaticLayout: true,
      theme: 'vs-dark',
      contextmenu: true,
      mouseWheelZoom: true,
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      renderLineHighlight: 'gutter',
      selectOnLineNumbers: true,
      matchBrackets: 'always',
      folding: true,
      foldingHighlight: true,
      showFoldingControls: 'mouseover',
      bracketPairColorization: {
        enabled: true
      }
    });

    // Update cursor decorations for collaborative users
    updateCursorDecorations(editor, monaco);
  };

  const updateCursorDecorations = (editor, monaco) => {
    if (!editor || !users) return;

    // Clear previous decorations
    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);

    // Create new decorations for each user's cursor
    const newDecorations = users
      .filter(user => user.id !== 1) // Exclude current user
      .map(user => ({
        range: new monaco.Range(
          user.cursor.line,
          user.cursor.column,
          user.cursor.line,
          user.cursor.column + 1
        ),
        options: {
          className: 'user-cursor',
          stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
          afterContentClassName: 'user-cursor-line',
          hoverMessage: { value: `${user.name} is here` },
          beforeContentClassName: 'user-cursor-label',
          glyphMarginClassName: 'user-cursor-glyph',
          inlineClassName: 'user-cursor-inline',
          style: `border-left: 2px solid ${user.color};`
        }
      }));

    decorationsRef.current = editor.deltaDecorations([], newDecorations);
  };

  const handleChange = (value) => {
    onChange(value || '');
  };

  // Update decorations when users change
  useEffect(() => {
    if (editorRef.current) {
      updateCursorDecorations(editorRef.current, window.monaco);
    }
  }, [users]);

  return (
    <div className="code-editor-wrapper">
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          selectOnLineNumbers: true,
          automaticLayout: true,
          contextmenu: true,
          mouseWheelZoom: true,
          fontSize: 14,
          fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
          lineNumbers: 'on',
          minimap: { enabled: true },
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          renderLineHighlight: 'gutter',
          matchBrackets: 'always',
          folding: true,
          showFoldingControls: 'mouseover',
          bracketPairColorization: {
            enabled: true
          }
        }}
      />
      <style jsx>{`
        .user-cursor {
          position: relative;
        }
        .user-cursor-line::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 2px;
          height: 100%;
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default CodeEditor;
