import beerGlass from '../assets/beer_glass.png';
import communityLove from '../assets/communityLove.png';
import productArt from '../assets/Gemini_Generated_Image_tduvgytduvgytduv.png';
import productCan from '../assets/genric_beer_can.png';
import heritageBlend from '../assets/heritageBlend.png';
import lightThemeImage from '../assets/light_theme_middle_section.png';
import monsoonBeerCan from '../assets/monsoonBeerCan.png';
import monsoonSpirit from '../assets/monsoonSpirit.png';
import mumbaiTaxi from '../assets/mumbai_taxi.png';
import nordicCrafted from '../assets/nordicCrafted.png';
import premiumReserve from '../assets/premiumReserve.png';

const bundledImages: Record<string, string> = {
  'beer_glass.png': beerGlass,
  'communityLove.png': communityLove,
  'Gemini_Generated_Image_tduvgytduvgytduv.png': productArt,
  'genric_beer_can.png': productCan,
  'heritageBlend.png': heritageBlend,
  'light_theme_middle_section.png': lightThemeImage,
  'monsoonBeerCan.png': monsoonBeerCan,
  'monsoonSpirit.png': monsoonSpirit,
  'mumbai_taxi.png': mumbaiTaxi,
  'nordicCrafted.png': nordicCrafted,
  'premiumReserve.png': premiumReserve,
};

export function resolveCmsImage(imageName: string | undefined, fallback: string) {
  if (!imageName) return fallback;
  if (imageName.startsWith('/')) return imageName;
  return bundledImages[imageName] || fallback;
}
