import React from 'react';

import { useQuill } from 'react-quilljs';
// or const { useQuill } = require('react-quilljs');

import 'quill/dist/quill.snow.css'; // Add css for snow theme
// or import 'quill/dist/quill.bubble.css'; // Add css for bubble theme

const QuillComponent = () => {
  const { quill, quillRef } = useQuill();

  React.useEffect(() => {
    if (quill) {
      quill.on('text-change', (delta, oldDelta, source) => {
        console.log('Text change!');
        console.log(quill.getText()); // Get text only
        console.log(quill.getContents()); // Get delta contents
        console.log(quill.root.innerHTML); // Get innerHTML using quill
        console.log(quillRef.current.firstChild.innerHTML); // Get innerHTML using quillRef
      });
    }
  }, [quill]);

  return (
    <div style={{ width: '100%', height: 300, borderRadius:20}}>
      <div style={{borderBottomLeftRadius:20, borderBottomRightRadius:20}} ref={quillRef} />
    </div>
  );
};
export default QuillComponent;