echo "\\newcommand{\\darkOrLight}{"$(cat ../notes/classnotes.md|grep "color:"|sed "s/color:\s*//g")"}" > darkOrLight

