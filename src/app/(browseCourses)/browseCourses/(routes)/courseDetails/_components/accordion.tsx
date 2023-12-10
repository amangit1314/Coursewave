"use client";

import React from 'react'
import { SlArrowUp } from 'react-icons/sl'

const Accordion = () => {
    const [list, setList] = React.useState([
        {
            sectionId: 1,
            title: 'Introduction',
            description: 'This is an introduction video'
        },
        {
            title: 'Know your instructor',
            description: 'Get to know your course instructor'
        },
    ]);
    return (
        <div className='bg-slate-100 list my-1 dark:bg-gray-800 py-1 rounded-xl border dark:border-gray-700'>
            {
                list.map((accordion, key) => {
                    return (
                        <div key={key} className='dark:border-gray-300 border-b-1'>
                            <AccordionItem key={key} data={accordion} />
                        </div>
                    )
                })
            }
        </div>
    )
}

const AccordionItem = (props: any) => {

    const [item, setItem] = React.useState(props.data);
    const toggleActiveItem = () => {
        let newActive = item.active === 1 ? 0 : 1;
        setItem({ ...item, active: newActive });
    }

    return (
        <div className={` bg-slate-100 p-3 md:p-5  group rounded-md dark:bg-gray-800 ${item.active === 1 ? 'activated' : ''}`}>
            <div className='flex items-center py-auto justify-between'>
                <div className='flex items-center py-auto'
                    onClick={toggleActiveItem}
                >
                    <div className='px-1 cursor-pointer group-[.activated]:rotate-180'
                    > <SlArrowUp size={10} /> </div>
                    <div className='pl-1 group-[.activated]:text-indigo-500 hover:text-indigo-500 group-[.activated]:font-semibold cursor-pointer text-xs md:text-sm'>{item.title}</div>
                </div>

                
                    <div className='hidden md:flex md:visible items-center justify-end'>
                        {/* lections */}
                        <p className='text-sm text-gray-600 px-1'>◽ 3 lectures</p>
                        {/* total length */}
                    <p className='text-sm text-gray-600'>◽ 15min</p>
                    </div>
                
            </div>
            <div className='overflow-hidden group-[.activated]:max-h-[120px] max-h-0 text-sm'>
                <div className='mt-1 ml-5'>{item.description}</div>
            </div>
        </div>
    );
}

export default Accordion