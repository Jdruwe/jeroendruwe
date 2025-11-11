import {cn as tvCn, type CnOptions} from "tailwind-variants";

export function cn(...options: CnOptions) {
    return tvCn(options)({twMerge: true})
}
