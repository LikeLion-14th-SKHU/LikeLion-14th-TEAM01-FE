const waitForImage = async (image: HTMLImageElement) => {
  if (!image.complete || image.naturalWidth === 0) {
    await new Promise<void>((resolve, reject) => {
      image.addEventListener('load', () => resolve(), { once: true });
      image.addEventListener('error', () => reject(new Error('패스 이미지를 불러오지 못했습니다.')), {
        once: true,
      });
    });
  }

  if (typeof image.decode === 'function') await image.decode().catch(() => undefined);
};

const fitTextWithEllipsis = (
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) => {
  if (context.measureText(text).width <= maxWidth) return text;

  const characters = Array.from(text);
  while (characters.length > 0) {
    characters.pop();
    const shortened = `${characters.join('').trimEnd()}…`;
    if (context.measureText(shortened).width <= maxWidth) return shortened;
  }

  return '…';
};

const canvasToBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('패스 이미지를 만들지 못했습니다.'));
    }, 'image/png');
  });

export async function downloadDesignerPass(element: HTMLElement, username: string) {
  const image = element.querySelector<HTMLImageElement>('[data-designer-pass-image]');
  const name = element.querySelector<HTMLElement>('[data-designer-pass-name]');
  if (!image || !name) throw new Error('저장할 Designer Pass를 찾지 못했습니다.');

  await Promise.all([document.fonts.ready, waitForImage(image)]);

  const elementBounds = element.getBoundingClientRect();
  const nameBounds = name.getBoundingClientRect();
  if (elementBounds.width === 0 || elementBounds.height === 0) {
    throw new Error('Designer Pass가 화면에 표시된 뒤 다시 시도해 주세요.');
  }

  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('패스 이미지를 만들 수 없습니다.');

  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const scaleX = canvas.width / elementBounds.width;
  const scaleY = canvas.height / elementBounds.height;
  const computedName = window.getComputedStyle(name);
  const fontSize = Number.parseFloat(computedName.fontSize) * scaleY;
  context.font = `${computedName.fontStyle} ${computedName.fontWeight} ${fontSize}px ${computedName.fontFamily}`;
  context.fillStyle = computedName.color;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.shadowColor = 'rgba(255, 255, 255, 0.3)';
  context.shadowOffsetY = scaleY;

  const nameX = (nameBounds.left + nameBounds.width / 2 - elementBounds.left) * scaleX;
  const nameY = (nameBounds.top + nameBounds.height / 2 - elementBounds.top) * scaleY;
  const maxNameWidth = nameBounds.width * scaleX;
  const displayName = name.textContent?.trim() || 'GUEST';
  context.fillText(fitTextWithEllipsis(context, displayName, maxNameWidth), nameX, nameY);

  const blob = await canvasToBlob(canvas);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeName = (username.trim() || 'GUEST').replace(/[\\/:*?"<>|]+/g, '-');
  link.href = url;
  link.download = `MCM-Designer-Pass-${safeName}.png`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
