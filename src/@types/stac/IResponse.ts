export interface Stac {
  type: string
  links: string[]
  context: Context
  features: Feature[]
}

export interface Context {
  matched: number
  returned: number
}

export interface Feature {
  type: string
  id: string
  collection: string
  stac_version: string
  stac_extensions: string[]
  geometry: Geometry
  links: Link[]
  bbox: number[]
  assets: { [key: string]: Asset }
  properties: Properties
}

export interface Asset {
  href: string
  type: string
  roles: string[]
  created: string
  updated: string
  'bdc:size': number
  'bdc:raster_size'?: BdcRasterSize
  'checksum:multihash': string
  'eo:bands'?: EoBand[]
}

export interface BdcRasterSize {
  x: number
  y: number
}

export interface EoBand {
  name: string
  common_name: string
  description: string
  min: number
  max: number
  nodata: number
  scale: number
  scale_add: number | null
  data_type: string
  resolution_x: number
  resolution_y: number
  center_wavelength: number
  full_width_half_max: number
}

export interface Geometry {
  type: string
  coordinates: Array<Array<number[]>>
}

export interface Link {
  href: string
  rel: string
}

export interface Properties {
  datetime: string
  start_datetime: string
  end_datetime: string
  created: string
  updated: string
  'bdc:tile': string
  'eo:cloud_cover': string | null
}
