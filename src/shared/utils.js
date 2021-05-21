export const ARTWORK_TYPE = {
  AUCTION: 1, CATALOGUE_RAISSONE: 2, ONLINE: 3,
  MUSEUM: 4, PRIVATE_COLLECTION: 5
}

export function getSourceStr(input){
  switch(input){
    case ARTWORK_TYPE.AUCTION: return 'AUCTION';
    case ARTWORK_TYPE.CATALOGUE_RAISSONE: return 'CATALOGUE RAISONNÉ';
    case ARTWORK_TYPE.ONLINE: return 'ONLINE';
    case ARTWORK_TYPE.MUSEUM: return 'MUSEUM';
    case ARTWORK_TYPE.PRIVATE_COLLECTION: return 'PRIVATE COLLECTION';
  }
}

export function getSource(input){
  // Devil's logic
  let source = ''

  // Auction
  if( ['A', 'P', 'YY', 'NN'].includes(input) ) source = ARTWORK_TYPE.AUCTION;

  // CatRais
  const catRaisList1 = ['K', 'L', 'B', 'E', 'R', 'G', 'J', 'C', ]
  const catRaisList2 = ['O', 'U', 'H', 'I', 'S', 'W', 'M', '0', 'Z', 'JB', 'GL', 'CR']
  const catRaisList = [...catRaisList1, ...catRaisList2]
  if( catRaisList.includes(input) ) source = ARTWORK_TYPE.CATALOGUE_RAISSONE;
  
  // Online
  if( ['N', 'Y', 'D'].includes(input) ) source = ARTWORK_TYPE.ONLINE;
  
  // Museum
  const museumList = ['X', 'F', '9', '8', '7', '6', 'RM', 'MT', 'AR', 'NG'];
  if( museumList.includes(input) ) source = ARTWORK_TYPE.MUSEUM;

  // Private Collection
  const pcList1 = ['T', 'V', '2', 'TD', 'EC', 'BA', 'HA', 'CD', 'AP', 'FB', 'SG', 'TB', 'BF']
  const pcList2 = ['49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
  const pcList = [...pcList1, ...pcList2]
  if( pcList.includes(input) ) source = ARTWORK_TYPE.PRIVATE_COLLECTION;

  return source
}