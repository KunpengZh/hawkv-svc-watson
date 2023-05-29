export type listFolderItemsParam = {
    folderId: string;
    fields?: string | string[];
    offset?: number;
    limit?: number;
    usemarker?: boolean;
    marker?: string;
}
export type listFolderItemsResponse = {
    entries: {
        id: string;
        type: string;
        name: string;
        etag: string;
    }[];
    limit?: number;
    next_marker?: string;
    total_count?: number;
    offset?: number;
}
export type createFolderResponse = {
    type: string;
    id: string;
    name: string;
}
export type createFileResponse={
    total_count: number;
    entries: [
      {
        type: 'file',
        id: string;
        sequence_id: string;
        etag: string;
        name: string;
        size: 3088,
        created_at: string;
        modified_at:string;
        item_status: 'active'
      }
    ]
  }