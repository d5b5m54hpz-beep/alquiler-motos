import Afip from "@afipsdk/afip.js";

const cuit = process.env.AFIP_CUIT ? Number(process.env.AFIP_CUIT) : undefined;

export const afip = cuit
  ? new Afip({
      CUIT: cuit,
      cert: process.env.AFIP_CERT,
      key: process.env.AFIP_KEY,
      production: true,
    })
  : null;
