// "use client";

// import { Button } from '@/components/ui/button';
// import EditorJS from '@editorjs/editorjs';
// import React, { useEffect, useRef } from 'react';

// export default function Editor() {
//   const [isMounted, setIsMounted] = React.useState(false);
//   const ref = useRef<EditorJS>();

//   const initializeEditor = async () => {
//     const EditorJS = (await import("@editorjs/editorjs")).default;
//     const Header = (await import("@editorjs/header")).default;
//     const Table = (await import("@editorjs/table")).default;
//     const List = (await import("@editorjs/list")).default;

//     if (!ref.current) {
//       const editor = new EditorJS({
//         holder: 'editorjs',
//         tools: {
//           header: Header,
//           table: Table,
//           list: List
//         },
//       });

//       ref.current = editor;
//     }
//   }

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       setIsMounted(true);
//     }
//   }, []);

//   useEffect(() => {
//     const init = async () => {
//       await initializeEditor();
//     }

//     if (isMounted) {
//       init();

//       return () => {
//         if (ref.current) {
//           ref.current.destroy();
//         }
//       }
//     }
//   }, [isMounted]);

//   const save = () => {
//     if (ref.current) {
//       ref.current.save().then((outputData) => {
//         console.log("Article data: ", outputData);
//         alert(JSON.stringify(outputData));
//       })
//     }
//   };

//   return (
//     <div>
//       <div id='editorjs' className='prose max-w-full min-h-screen'></div>
//       <Button onClick={save}>Save</Button>
//     </div>
//   );

// }