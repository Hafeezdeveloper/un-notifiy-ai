import { Card, CardContent } from '@mui/material'
import React from 'react'

const sectionBot = (props: any) => {
    let { data } = props
    return (
        <div>
            <div className="grid md:grid-cols-3 gap-8 mt-16">
                {/* {data ? data.map((x, i) => {
                    return (

                        <Card key={i}>
                            <CardContent className="pt-6 text-center">
                                <div className={`mx-auto w-12 h-12 flex items-center justify-center rounded-full ${bg} ${text} mb-4`}>
                                    {icon}
                                </div>
                                <h3 className="font-serif text-xl font-bold mb-2">{title}</h3>
                                <p className="text-gray-600">{desc}</p>
                            </CardContent>
                        </Card>
                    )
}   )} */}
            </div>
        </div>
    )
}

export default sectionBot
