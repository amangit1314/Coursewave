import React from 'react'

const ChapterPage = () => {
  return (
    <div className='py-20 px-8'>
      <p>Chapter Page</p>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} size={"sm"} />
              <h2 className="text-lg text-gray-700 font-medium">
                Customize your chapter
              </h2>
            </div>
            <ChapterTitleForm
              initialData={{ title: chapter.videoTitle }}
              courseId={params.courseId}
              chapterId={`params.chapterId`}
            />
            <ChapterDescriptionForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={`params.chapterId`}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Eye} size={"sm"} />
              <h2 className="text-lg text-gray-700 font-medium">
                Access Settings
              </h2>
            </div>
            <ChapterAccessForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={`params.chapterId`}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Video} size={"sm"} />
            <h2 className="text-lg text-gray-700 font-medium">Add a video</h2>
          </div>
          <ChapterVideoForm
            initialData={chapter}
            chapterId={`params.chapterId`}
            courseId={params.courseId}
          />
        </div>
      </div> */}
    </div>
  );
}

export default ChapterPage