import React from 'react'
import {Link} from "react-router-dom"

const Hero = () => {
    return (
        <section className='max-padd-container pt-[99px] overflow-x-hidden'>
            <div className='bg-hero bg-center bg-no-repeat bg-cover h-[400px] sm:h-[500px] md:h-[655px] w-full rounded-3xl px-4 sm:px-6 lg:px-12'>
                <div className='relative top-16 sm:top-24 md:top-32 lg:top-52'>
                    <span className='medium-18 text-sm sm:text-base'>Welcome to CasaCentral</span>
                    <h1 className='h1 capitalize max-w-full sm:max-w-[30rem] md:max-w-[40rem] text-2xl sm:text-3xl md:text-4xl lg:text-5xl'>Discover Exceptional Homes with Casacentral</h1>
                    <p className='my-4 sm:my-6 md:my-10 max-w-full sm:max-w-[25rem] md:max-w-[33rem] text-sm sm:text-base'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Non rerum dolorum cumque magni rem illo quia, autem porro excepturi.</p>
                    {/* button */}
                    <div className='inline-flex items-center justify-center gap-2 sm:gap-4 p-2 bg-white rounded-xl'>
                        <div className='text-center regular-14 leading-tight pl-3 sm:pl-5 hidden xs:block'>
                            <h5 className='uppercase font-bold text-xs sm:text-sm'>10% Off</h5>
                            <p className='regular-14 text-xs sm:text-sm'>On All Properties</p>
                        </div>
                        <Link to={'/listing'} className={"btn-secondary rounded-xl flexCenter !py-3 sm:!py-5 text-sm sm:text-base"}>Shop now</Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero