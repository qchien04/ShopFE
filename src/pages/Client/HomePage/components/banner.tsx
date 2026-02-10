import React from 'react';
import styles from './banner.module.scss';
import slide1 from "../../../../assets/bannerslide1.webp"
import slide2 from "../../../../assets/bannerslide2.webp"
import sideBanner from "../../../../assets/sidebanner.webp"
import { Carousel } from 'antd';
import {
    ShopOutlined,
    ThunderboltOutlined,
    SkinOutlined,
    GiftOutlined,
    SmileOutlined,
    DollarCircleOutlined,
} from '@ant-design/icons';

const slides = [
    slide1,slide2
];

const features = [
    { icon: <ShopOutlined />, label1: 'Shopee Xử Lý' },
    { icon: <ThunderboltOutlined />, label1: 'Deal Hot', label2: 'Giờ Vàng' },
    { icon: <SkinOutlined />, label1: 'Shopee Style', label2: 'Voucher 30%' },
    { icon: <GiftOutlined />, label1: 'Săn Ngay', label2: '100.000 Xu' },
    { icon: <SmileOutlined />, label1: 'Khách Hàng', label2: 'Thân Thiết' },
    { icon: <DollarCircleOutlined />, label1: 'Mã Giảm Giá' },
];


const Banner: React.FC = () => {
    return (
        <section>
            <div className={styles.container}>
                {/* Carousel (antd) */}
                <div className={styles.mainBanner}>
                    <Carousel
                        className={styles.carousel}
                        autoplay
                        autoplaySpeed={3500}
                        pauseOnHover
                        dots
                        arrows
                        draggable
                    >
                        {slides.map((src, i) => (
                            <div className={styles.slide} key={i}>
                                <img style={{height: 415}} src={src} alt={`banner ${i + 1}`} />
                            </div>
                        ))}
                    </Carousel>
                </div>

                {/* right side banners */}
                <div className={styles.sideBanners}>
                    <img style={{height: 205}} src={sideBanner} alt="sub1" />
                    <img style={{height: 205}} src={slide1} alt="sub2" />
                </div>
            </div>

            {/* features under banner */}
            <div className={styles.features}>
                {features.map((f, idx) => (
                    <a key={idx} href="#" className={styles.featureItem}>
                        <span className={styles.featureIcon}>{f.icon}</span>
                        <span className={styles.featureText}>
                            {f.label1}
                            {f.label2 ? (
                                <>
                                    <br />
                                    {f.label2}
                                </>
                            ) : null}
                        </span>
                    </a>
                ))}
            </div>
        </section>
    );
};

export default Banner;