import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const usePresentationNavigation = (
  presentationId: string,
  selectedSlide: number,
  setSelectedSlide: (slide: number) => void,
  setIsFullscreen: (fullscreen: boolean) => void
) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isPresentMode = searchParams.get("mode") === "present";
  const isEmbedMode = searchParams.get("embed") === "1";
  const stream = searchParams.get("stream");
  const currentSlide = parseInt(
    searchParams.get("slide") || `${selectedSlide}` || "0"
  );

  const handleSlideClick = useCallback((index: number) => {
    const slideElement = document.getElementById(`slide-${index}`);
    if (slideElement) {
      slideElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setSelectedSlide(index);
    }
  }, [setSelectedSlide]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, [setIsFullscreen]);

  const handlePresentExit = useCallback(() => {
    setIsFullscreen(false);
    if (isEmbedMode) return;
    router.push(`/presentation?id=${presentationId}`);
  }, [router, presentationId, setIsFullscreen, isEmbedMode]);

  const handleSlideChange = useCallback((newSlide: number, presentationData: any) => {
    if (newSlide >= 0 && newSlide < presentationData?.slides.length!) {
      setSelectedSlide(newSlide);
      const embedParam = isEmbedMode ? "&embed=1" : "";
      router.push(
        `/presentation?id=${presentationId}&mode=present&slide=${newSlide}${embedParam}`,
        { scroll: false }
      );
    }
  }, [router, presentationId, setSelectedSlide, isEmbedMode]);

  return {
    isPresentMode,
    isEmbedMode,
    stream,
    currentSlide,
    handleSlideClick,
    toggleFullscreen,
    handlePresentExit,
    handleSlideChange,
  };
}; 
