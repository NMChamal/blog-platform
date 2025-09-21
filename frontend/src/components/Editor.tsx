import { useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useApi } from '../hooks/useApi';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

const Editor = ({ value, onChange }: EditorProps) => {
  const quillRef = useRef<ReactQuill>(null);
  const { post } = useApi('/api/upload');

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.setAttribute('multiple', 'true');
    input.click();

    input.onchange = async () => {
      if (!input.files) return;

      const formData = new FormData();
      for (let i = 0; i < input.files.length; i++) {
        formData.append('images', input.files[i]);
      }

      try {
        const res = await post(formData);
        const urls = res.data.urls;
        const quill = quillRef.current?.getEditor();
        if (quill) {
          urls.forEach((url: string) => {
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', url);
          });
        }
      } catch (error) {
        console.error('Image upload failed:', error);
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
    />
  );
};

export default Editor;
