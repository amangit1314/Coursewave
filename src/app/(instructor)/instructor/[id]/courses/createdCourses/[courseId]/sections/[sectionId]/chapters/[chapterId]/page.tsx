import React from 'react'

const ChapterEditPage = ({params}: {params: {chapterId: string}}) => {
  return (
    <div>
      {/* ChapterEditPage */}
      <div>Chapter Id: {params?.chapterId}</div>
    </div>
  )
}

export default ChapterEditPage