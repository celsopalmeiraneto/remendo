import PouchDB from 'pouchdb';

export class TireRepairShop {
  constructor() {
    this.address = null;
    this.coords = {
      lat: null,
      lng: null,
    };
    this.id = null;
    this.name = null;
    this.operationHours = null;
    this.pictureUrl = null;
  }
}

TireRepairShop._db = new PouchDB('http://127.0.0.1:5984/remendo');

TireRepairShop._queryIndexByCoords = async ({ne, sw, includeDocs = true}) => {
  if (!ne || !sw) return [];
  const res = await TireRepairShop._db.query('repairShops/byCoords', {
    startkey: [sw.lat, sw.lng],
    endkey: [ne.lat, ne.lng],
    include_docs: includeDocs,
  });
  if (includeDocs) {
    return res.rows.map((row) => {
      const repairShop = new TireRepairShop();
      return Object.assign(repairShop, row.doc);
    });
  } else {
    return res.rows.length;
  }
};

TireRepairShop.findByCoords = TireRepairShop._queryIndexByCoords;

TireRepairShop.findByNameAndCoords = async ({name,
  ne, sw,
  includeDocs = true,
}) => {
  const docs = await TireRepairShop._queryIndexByCoords({ne, sw,
    includeDocs: true,
  });
  name = name.toLowerCase();
  return docs.filter((doc) => doc.name.toLowerCase().includes(name));
};
