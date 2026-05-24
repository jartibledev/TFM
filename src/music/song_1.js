// src/music/song_1.js

export const song_1 = () => {
  const chorus = ["a3", "e3", "c3", "g3", "e3", "b3", "f#3", "d3", "a3", "a3", "c#3", "g3", "a3"];
  const verse  = ["c3", "a3", "a3", "e3", "b3", "e3", "e3", "a3", "f#3", "a3", "d3", "d3", "c#3", "a3", "g3", "c#3"];
  const refrain = ["a3", "e3", "c3", "g3", "e3", "b3", "f#3", "d3", "a3", "a3", "c#3", "g3", "a3"];

  const listaBajos = ["a2", "e2", "d2", "a2"];

  return {
    melodia: [...chorus, ...chorus, ...verse, ...refrain],
    bajos: listaBajos
  };
};