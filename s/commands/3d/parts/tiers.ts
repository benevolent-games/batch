
import sharp from "sharp"
import {Transform} from "@gltf-transform/core"
import {dedup, textureCompress} from "@gltf-transform/functions"

import {delete_meshes} from "./transforms/delete_meshes.js"
import {std_transforms} from "./transforms/std_transforms.js"
import {delete_all_normal_maps} from "./transforms/delete_all_normal_maps.js"

export type Tiers = typeof tiers
export type TierName = keyof Tiers
export type Tier = ({}: TierOptions) => Transform[]
export type TierOptions = {textureFormat: TextureFormat}
export type TextureFormat = "webp" | "jpeg" | "png" | "avif"
export const textureFormats: TextureFormat[] = ["webp", "jpeg", "png", "avif"]

export function asTier(tier: Tier) {
	return tier
}

export const tiers = {

	fancy: asTier(({textureFormat}) => [
		dedup(),
		textureCompress({
			encoder: sharp,
			quality: 90,
			resize: [1024, 1024],
			targetFormat: textureFormat,
		}),
		...std_transforms,
	]),

	mid: asTier(({textureFormat}) => [
		dedup(),
		textureCompress({
			encoder: sharp,
			quality: 90,
			resize: [512, 512],
			targetFormat: textureFormat,
		}),
		delete_meshes("::lod=0"),
		...std_transforms,
	]),

	potato: asTier(({textureFormat}) => [
		dedup(),
		textureCompress({
			encoder: sharp,
			quality: 90,
			resize: [128, 128],
			targetFormat: textureFormat,
		}),
		delete_meshes("::lod=0", "::lod=1"),
		delete_all_normal_maps(),
		...std_transforms,
	]),

} satisfies Record<string, (...args: any[]) => Transform[]>

