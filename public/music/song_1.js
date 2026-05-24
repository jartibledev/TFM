
const chorus ={
  A0 : "a e c",
  A1 : "g e b",
  B0 : "f# d a",
  A0P : "a c# g a"
  }
const verse = {
  C0 : "c a!2 e",
  C1 : "b e!2 a",
  D0 : "f# a d!2",
  C0P :"c# a g c#"
}
const refrain = {
  R0 : "a/2 e c",
  R1 : "g e/2 b",
  F0 : "f# d a/2",
  R0P : "a c# g a/2"
}

$: chord("<Am Em D A7>").voicing().sound("gm_acoustic_bass")._punchcard()
$: chord("<Am Em D A7>").voicing().sound("gm_electric_guitar_muted").room(.5)._punchcard()


$:cat(chorus.A0, chorus.A1, chorus.B0, chorus.A0P,
      chorus.A0, chorus.A1, chorus.B0, chorus.A0P,
      verse.C0, verse.C1, verse.D0, verse.C0P,
     refrain.R0,refrain.R1, refrain.F0, refrain.R0P )
  .note()
  .sound("piano,vibraphone_soft")
  ._punchcard()
//gm_distortion_guitar
/*$:cat(chorus.A0, chorus.A1, chorus.B0, chorus.A0P,
      chorus.A0, chorus.A1, chorus.B0, chorus.A0P,
      verse.C0, verse.C1, verse.D0, verse.C0P)
  .note()
  .sound("gm_electric_guitar_clean")
  ._punchcard()*/







$:sound("ht <mt rd>*2 ").bank("RolandTR909")._punchcard()