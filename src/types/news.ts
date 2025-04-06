export interface News {
  lang: string
  author: string
  title: string
  publisher: string
  image: Image
  date: string
  url: string
  description: string
  logo: Logo
}

export interface Image {
  url: string
  type: string
  size: number
  height: number
  width: number
  size_pretty: string
}

export interface Logo {
  url: string
  type: string
  size: number
  height: number
  width: number
  size_pretty: string
}

export interface SupabaseNews {
  id: string
  url: string
  date: string
  title: string
  imageurl: string
  description: string
  created_at?: string
  updated_at?: string
}
