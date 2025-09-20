import { useCallback, useRef, useState } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Button } from "../../../ui/button";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../ui/dialog";

const schema = z.object({
  image: z
    .instanceof(File, { message: "Please select an image file" })
    .refine((file) => file.size <= 10240 * 1024, {
      message: "Maximum file size is 10 MB",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      {
        message: "Only JPG, PNG, or GIF files are allowed",
      }
    ),
});

interface DialogPostUploadImageProps {
  isOpen: boolean;
  onClose: () => void;
  insertImage: (url: string) => void;
  userId: string;
  cropMode?: "flex" | "square" | "rectangle";
}

export default function DialogPostUploadImage({
  isOpen,
  onClose,
  insertImage,
  userId,
  cropMode = "flex",
}: DialogPostUploadImageProps) {
  const cropperRef = useRef<Cropper | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onCropperInit = useCallback((cropper) => {
    cropperRef.current = cropper;
  }, []);

  const formik = useFormik({
    initialValues: { image: null as File | null },
    validationSchema: toFormikValidationSchema(schema),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!values.image || !cropperRef.current) return;

      try {
        const canvas = cropperRef.current.getCroppedCanvas();
        if (!canvas) throw new Error("Cropping failed");

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((b) => resolve(b), "image/jpeg")
        );
        if (!blob) throw new Error("Empty blob");

        const formData = new FormData();
        formData.append("image", blob);
        formData.append("user_id", userId);
        formData.append("imageupload_access", "post-draft");

        //upload image
        const res = await fetch("/api/storeimage", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (res.ok && data.status === "success" && data.data) {
          insertImage(
            `${window.location.origin}/storage/${data.data.imageupload_path}`
          );
          resetCrop();
          resetForm();
          onClose();
        } else {
          console.error("Image upload failed:", data);
        }
      } catch (err) {
        console.error("Image upload error:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const getAspectRatio = () => {
    switch (cropMode) {
      case "square":
        return 1;
      case "rectangle":
        return 3 / 2;
      case "flex":
      default:
        return NaN;
    }
  };

  const resetCrop = () => {
    setPreviewUrl(null);
    formik.resetForm();
  };

  const handleClose = () => {
    resetCrop();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>

        {!previewUrl && (
          <div className="upload-image flex flex-col">
            <label
              htmlFor="image-upload"
              className="cursor-pointer block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
          bg-white text-gray-700 text-center
          hover:bg-gray-100
          focus:outline-none focus:ring-indigo-300 focus:border-indigo-300
          transition-colors duration-300"
            >
              {formik.values.image
                ? formik.values.image.name
                : "Choose an image"}
            </label>
            <input
              id="image-upload"
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  formik.setFieldValue("image", file);
                  setPreviewUrl(URL.createObjectURL(file));
                }
              }}
              className="hidden"
            />
          </div>
        )}

        {formik.errors.image && formik.touched.image && (
          <p className="text-red-400 text-xs mt-1 flex items-center">
            <i className="fas fa-exclamation-circle me-1 text-[10px] mb-0.5"></i>
            {formik.errors.image as string}
          </p>
        )}

        {previewUrl && (
          <div className="relative w-full h-64 bg-gray-200">
            <Cropper
              src={previewUrl}
              style={{ height: "100%", width: "100%" }}
              initialAspectRatio={getAspectRatio()}
              aspectRatio={getAspectRatio()}
              guides={true}
              cropBoxResizable={true}
              cropBoxMovable={true}
              zoomable={true}
              viewMode={1}
              onInitialized={onCropperInit}
            />
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            className="w-30 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
            onClick={resetCrop}
          >
            Reset crop
          </Button>
          <Button
            type="button"
            className="w-30 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => formik.submitForm()}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
