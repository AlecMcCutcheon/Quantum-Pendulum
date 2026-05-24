export interface OpeningQuote {
  text: string;
  author: string;
  role?: string;
}

/**
 * Opening splash quotes — cosmos, consciousness, interdependence, participatory physics.
 * User favorites plus additional lines with documented attributions where possible.
 */
export const OPENING_QUOTES: OpeningQuote[] = [
  {
    text: "The cosmos is within us. We are made of star-stuff. We are a way for the cosmos to know itself.",
    author: "Carl Sagan",
    role: "Cosmos",
  },
  {
    text: "Through our eyes, the universe is perceiving itself. Through our ears, the universe is listening to its harmonies. We are the witnesses through which the universe becomes conscious of its glory, of its magnificence.",
    author: "Alan Watts",
  },
  {
    text: "We are part of this universe; we are in this universe, but perhaps more important than both of those facts, is that the universe is in us.",
    author: "Neil deGrasse Tyson",
  },
  {
    text: "It is incontrovertible that the observer is a participator… The universe is a participatory universe.",
    author: "John Wheeler",
    role: "Physicist",
  },
  {
    text: "We are participators in bringing into being not only the near and here but the far away and long ago.",
    author: "John Wheeler",
    role: "Physicist",
  },
  {
    text: "You are not a drop in the ocean. You are the entire ocean, in a drop.",
    author: "Rumi",
  },
  {
    text: "We are here to awaken from our illusion of separateness.",
    author: "Thich Nhat Hanh",
  },
  {
    text: "A human being is a part of the whole, called by us Universe, a part limited in time and space. He experiences himself, his thoughts and feeling as something separated from the rest, a kind of optical delusion of his consciousness.",
    author: "Albert Einstein",
    role: "Letter, 1950",
  },
  {
    text: "Science cannot solve the ultimate mystery of nature. And that is because, in the last analysis, we ourselves are a part of the mystery we are trying to solve.",
    author: "Max Planck",
  },
  {
    text: "All things are woven together and the common bond is sacred, and scarcely one thing is foreign to another, but they are all combined and mingle together as in one great body.",
    author: "Marcus Aurelius",
    role: "Meditations",
  },
  {
    text: "The notion of a separate organism is clearly an abstraction, as is also its boundary. Underlying all this is unbroken wholeness.",
    author: "David Bohm",
  },
  {
    text: "We are bits of stellar matter which has entered upon a bodily adventure.",
    author: "Arthur Eddington",
    role: "Stars and Atoms",
  },
  {
    text: "Look up at the stars and not down at your feet. Try to make sense of what you see, and wonder about what makes the universe exist. Be curious.",
    author: "Stephen Hawking",
  },
  {
    text: "The nitrogen in our DNA, the calcium in our teeth, the iron in our blood, the carbon in our apple pies were made in the interiors of collapsing stars. We are made of star-stuff.",
    author: "Carl Sagan",
    role: "Cosmos",
  },
  {
    text: "There is a vitality, a life force, an energy, a quickening that is translated through you into action, and because there is only one of you in all of time, this expression is unique.",
    author: "Martha Graham",
    role: "often quoted by Agnes de Mille",
  },
  {
    text: "The atoms of our bodies are traceable to stars that manufactured them in their cores and exploded these enriched ingredients across our galaxy.",
    author: "Neil deGrasse Tyson",
  },
  {
    text: "Every one of us is, in the cosmic perspective, precious. If a human disagrees with you, let him live. In a hundred billion galaxies, you will not find another.",
    author: "Carl Sagan",
    role: "Cosmos",
  },
  {
    text: "What we observe is not nature itself, but nature exposed to our method of questioning.",
    author: "Werner Heisenberg",
  },
  {
    text: "The total number of minds in the universe is one.",
    author: "Erwin Schrödinger",
    role: "Mind and Matter",
  },
  {
    text: "The world is not something separate from you and me; we are the world, and our problems are the world’s problems.",
    author: "Jiddu Krishnamurti",
  },
  {
    text: "The stars above are merely scattered dots until the mind draws its own constellation. We are bound to the cosmos, finding our own patterns of meaning in the vastness, where the universe becomes a reflection of the self.",
    author: "Alec McCutcheon",
  },
];

export function pickOpeningQuote(): OpeningQuote {
  const index = Math.floor(Math.random() * OPENING_QUOTES.length);
  return OPENING_QUOTES[index]!;
}
