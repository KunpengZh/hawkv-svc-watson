import ResponseWarp from "@shared/ResponseWarp";

export function getBoardList() {

    return ResponseWarp.successX([
        {
            title: 'ASEAN Board'
        },
        {
            title: 'GCG Board'
        }
    ])
}