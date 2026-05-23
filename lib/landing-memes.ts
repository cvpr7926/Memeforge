export type LandingMeme = {
  id: string;
  src: string;
  fallback?: string;
  alt: string;
};

/** Scattered hero slots — upright thumbnails, varied placement */
export const HERO_SCATTER: (LandingMeme & {
  pos: string;
  size?: "sm" | "md" | "lg" | "xl";
})[] = [
  { id: "drake", src: "https://i.imgflip.com/30b1gx.jpg", alt: "Drake", pos: "left-[0%] top-[2%]", size: "lg" },
  { id: "distracted", src: "https://i.imgflip.com/1ur9b0.jpg", alt: "Distracted", pos: "right-[0%] top-[0%]", size: "xl" },
  { id: "stonks", src: "https://i.imgflip.com/26am.jpg", alt: "Stonks", pos: "left-[2%] top-[22%]", size: "md" },
  { id: "fine", src: "https://i.imgflip.com/9ehk.jpg", alt: "Fine", pos: "right-[2%] top-[20%]", size: "lg" },
  { id: "aliens", src: "https://i.imgflip.com/26hg.jpg", alt: "Aliens", pos: "left-[-1%] top-[48%]", size: "md" },
  { id: "harold", src: "https://i.imgflip.com/23ls.jpg", alt: "Harold", pos: "right-[0%] top-[46%]", size: "lg" },
  { id: "leo", src: "https://i.imgflip.com/2fm6x.jpg", alt: "Leo", pos: "left-[14%] top-[10%]", size: "md" },
  { id: "doge", src: "https://i.imgflip.com/4t0t4.jpg", alt: "Doge", pos: "right-[12%] top-[8%]", size: "md" },
  { id: "cat", src: "https://i.imgflip.com/gk5elw.jpg", alt: "Cat", pos: "left-[6%] bottom-[14%]", size: "lg" },
  {
    id: "brain",
    src: "https://upload.wikimedia.org/wikipedia/en/thumb/8/82/Expanding_Brain_meme.jpg/220px-Expanding_Brain_meme.jpg",
    fallback: "https://i.imgflip.com/1bhk.jpg",
    alt: "Brain",
    pos: "right-[4%] bottom-[12%]",
    size: "lg",
  },
  { id: "simply", src: "https://i.imgflip.com/1bhk.jpg", alt: "Simply", pos: "left-[22%] bottom-[28%]", size: "md" },
  { id: "spidey", src: "https://i.imgflip.com/1g8my4.jpg", alt: "Spidey", pos: "right-[20%] bottom-[30%]", size: "md" },
  { id: "pikachu", src: "https://i.imgflip.com/3si4.jpg", alt: "Pikachu", pos: "left-[30%] top-[4%]", size: "sm" },
  { id: "disaster", src: "https://i.imgflip.com/1bhw.jpg", alt: "Disaster", pos: "right-[28%] top-[6%]", size: "sm" },
  { id: "gru", src: "https://i.imgflip.com/5c7lwq.jpg", alt: "Gru", pos: "left-[26%] bottom-[6%]", size: "md" },
  { id: "fry", src: "https://i.imgflip.com/1bhd.jpg", alt: "Fry", pos: "right-[30%] bottom-[8%]", size: "md" },
];

export const MARQUEE_TRAIN: LandingMeme[] = [
  { id: "m1", src: "https://i.imgflip.com/1bij.jpg", alt: "Simply walk" },
  { id: "m2", src: "https://i.imgflip.com/2gn4h1.jpg", alt: "Bike" },
  { id: "m3", src: "https://i.imgflip.com/1bgw.jpg", alt: "Raptor" },
  { id: "m4", src: "https://i.imgflip.com/1otk.jpg", alt: "Y U No", fallback: "https://i.imgflip.com/26hg.jpg" },
  { id: "m5", src: "https://i.imgflip.com/26xm.jpg", alt: "Tom", fallback: "https://i.imgflip.com/23ls.jpg" },
  { id: "m6", src: "https://i.imgflip.com/9vct1.jpg", alt: "Exit" },
  { id: "m7", src: "https://i.imgflip.com/1jhl6.jpg", alt: "Trade", fallback: "https://i.imgflip.com/30b1gx.jpg" },
  { id: "m8", src: "https://i.imgflip.com/7pdd.jpg", alt: "Bernie", fallback: "https://i.imgflip.com/9ehk.jpg" },
  { id: "m9", src: "https://i.imgflip.com/4acd7.png", alt: "Doge2", fallback: "https://i.imgflip.com/4t0t4.jpg" },
  { id: "m10", src: "https://i.imgflip.com/2/9vct.jpg", alt: "Panik", fallback: "https://i.imgflip.com/26am.jpg" },
  { id: "m11", src: "https://i.imgflip.com/3lmzyx.jpg", alt: "Clown", fallback: "https://i.imgflip.com/2fm6x.jpg" },
  { id: "m12", src: "https://i.imgflip.com/3vzej.jpg", alt: "Megamind", fallback: "https://i.imgflip.com/1ur9b0.jpg" },
  { id: "m13", src: "https://i.imgflip.com/30b1gx.jpg", alt: "Drake2" },
  { id: "m14", src: "https://i.imgflip.com/1ur9b0.jpg", alt: "Distracted2" },
  { id: "m15", src: "https://i.imgflip.com/26am.jpg", alt: "Stonks2" },
  { id: "m16", src: "https://i.imgflip.com/9ehk.jpg", alt: "Fine2" },
];
