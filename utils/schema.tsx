import { boolean, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const AIOutput=pgTable('aiOutput',{
    id:serial('id').primaryKey(),
    formData:varchar('formData'),
    aiResponse:text('aiResponse'),
    mindMapData:text('mindMapData'),
    templateSlug:varchar('templateSlug'),
    documentId:varchar('documentId'),
    createdBy:varchar('createdBy'),
    createdAt:varchar('createdAt')
})


export const DocumentVersions=pgTable('documentVersions',{
    id:serial('id').primaryKey(),
    documentId:varchar('documentId'),
    version:serial('version'),
    content:text('content'),
    createdBy:varchar('createdBy'),
    createdAt:varchar('createdAt'),
    changeDescription:varchar('changeDescription')
})