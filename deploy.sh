#read -n 1 -r -s -p $'You are about to deploy to prod. Press any key to continue\n'
scp -r build/* artwishlist:/home/storrellas/workspace/artwishlist_front/
