import '../styles/Photography.css';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useEffect, useState } from 'react';

import ScrollFloat from '../Effects/ScrollFloat';


const Photography = () => {

    const [photos, setPhotos] = useState([]);
  
    // Load all images from the assets/photography folder
    useEffect(() => {
        const importAll = (r) => {
            return r.keys().map((fileKey) => {
                // Extract filename without extension
                const filename = fileKey.replace('./', '').replace(/\.[^/.]+$/, '');
                
                // Split into index and name parts
                const parts = filename.split('-');
                const photoIndex = parseInt(parts[0]); // Changed variable name from 'index' to 'photoIndex'
                const name = parts.slice(1).join('-');
                
                return {
                    id: photoIndex, // Using photoIndex here instead of index
                    src: r(fileKey),
                    alt: name,
                    filename: filename
                };
            }).sort((a, b) => a.id - b.id);
        };
        
        try {
            const importedPhotos = importAll(
                require.context('../assets/photography', false, /\.(png|jpe?g|svg)$/)
            );
            setPhotos(importedPhotos);
        } catch (error) {
            console.error("Error loading images:", error);
        }
    }, []);
    
    // parameters for different screen sizes
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 4
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
            partialVisibilityGutter: 80 // adds partial visibility for next items
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
            partialVisibilityGutter: 30
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            partialVisibilityGutter: 20
        }
    };
    
    return (
        <div id="photography">
            <div className="container">
                {/* <h1 className="sub-title">Photography</h1> */}
                <ScrollFloat
                    animationDuration={1}
                    ease='back.inOut(2)'
                    scrollStart='center bottom+=50%'
                    scrollEnd='bottom bottom-=40%'
                    stagger={0.03}
                    >
                    Photography
                    </ScrollFloat>
                {photos.length > 0 ? (
                    <Carousel
                        swipeable={true}
                        draggable={true}
                        showDots={false}
                        responsive={responsive}
                        keyBoardControl={true}

                        infinite={true}
                        
                        
                        containerClass="carousel-container"
                        removeArrowOnDeviceType={["mobile"]}
                        dotListClass="custom-dot-list-style"
                        itemClass="carousel-item"

                        // movement
                        autoPlay={true}
                        shouldResetAutoplay={true}
                        autoPlaySpeed={3000}
                        customTransition="transform 300ms ease-in-out"
                        transitionDuration={300}

                        centerMode={true}
                        focusOnSelect={true}
                        
                        additionalTransfrom={0}
                    >
                        {photos.map((photo) => (
                            <div key={photo.id} className="photo-item">
                                <img 
                                src={photo.src} 
                                alt={photo.alt} 
                                className="carousel-image"
                                />
                                <div className="photo-overlay">
                                <h3>{photo.alt}</h3>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                ) : (
                    <p className="loading-text">Loading photos...</p>
                )}
            </div>
        </div>
    );
}

export default Photography