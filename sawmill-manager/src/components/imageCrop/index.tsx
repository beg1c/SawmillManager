import React, { useRef, useState } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { useModalReturnType, useTranslate } from '@refinedev/core';
import { Close } from '@mui/icons-material';
import { useDebounceEffect } from './useDebounceEffect';
import { canvasPreview } from './previewCanvas';

interface ImageCropProps extends useModalReturnType {
    imageSrc: string;
    onCropComplete: (image: Blob) => void;
}

const ImageCrop: React.FC<ImageCropProps> = ({
    visible, 
    close,
    imageSrc,
    onCropComplete,
}) => {

    const t = useTranslate();

    const imgRef = useRef<HTMLImageElement>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const [aspect, setAspect] = useState<number | undefined>(1)


    function centerAspectCrop(
        mediaWidth: number,
        mediaHeight: number,
        aspect: number,
    ){
        return centerCrop(
            makeAspectCrop(
                {
                unit: '%',
                width: 90,
                },
                aspect,
                mediaWidth,
                mediaHeight,
            ),
            mediaWidth,
            mediaHeight,
        )
    }

    useDebounceEffect(
        async () => {
          if (
            completedCrop?.width &&
            completedCrop?.height &&
            imgRef.current &&
            previewCanvasRef.current
          ) {
            canvasPreview(
              imgRef.current,
              previewCanvasRef.current,
              completedCrop,
            )
          }
        },
        100,
        [completedCrop],
      )

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        if (aspect) {
            const { width, height } = e.currentTarget
            setCrop(centerAspectCrop(width, height, aspect))
        }
    }

    async function makeCroppedBlob() {
        const image = imgRef.current
        const previewCanvas = previewCanvasRef.current
        if (!image || !previewCanvas || !completedCrop) {
            throw new Error('Crop canvas does not exist')
        }
    
        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height
    
        const offscreen = new OffscreenCanvas(
          completedCrop.width * scaleX,
          completedCrop.height * scaleY,
        )
        const ctx = offscreen.getContext('2d')
        if (!ctx) {
          throw new Error('No 2d context')
        }
    
        ctx.drawImage(
          previewCanvas,
          0,
          0,
          previewCanvas.width,
          previewCanvas.height,
          0,
          0,
          offscreen.width,
          offscreen.height,
        )

        const blob = await offscreen.convertToBlob({
          type: 'image/png',
        })

        return blob;
      }

    return (
        <>      
            <canvas
                ref={previewCanvasRef}
                style={{
                    position: "absolute",
                    visibility: "hidden",
                    border: '1px solid black',
                    objectFit: 'contain',
                    width: completedCrop?.width,
                    height: completedCrop?.height,
                }}
            />
            <Dialog
                fullWidth={true}
                maxWidth={"md"}
                open={visible}
                onClose={close}
            >
                <DialogTitle>{t("images.crop")}</DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={close}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <Close />
                </IconButton>
                <DialogContent>
                    {imageSrc && (
                        <ReactCrop
                            keepSelection={true}
                            crop={crop}
                            onComplete={(c) => setCompletedCrop(c)}
                            onChange={(_, percentCrop) => {
                                setCrop(percentCrop);
                            }}
                            aspect={1}
                            circularCrop
                            >
                            <img
                                onLoad={onImageLoad}
                                src={imageSrc}
                                ref={imgRef}
                            />
                            </ReactCrop>
                    )} 
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={async () => {
                                const outputBlob = await makeCroppedBlob();
                                onCropComplete(outputBlob);
                                close();
                        }}
                    >
                        {t("buttons.save")}
                    </Button>
                </DialogActions>
            </Dialog>
        </> 
    );
};

export default ImageCrop;

