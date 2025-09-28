"use client"
import React, { useState, useEffect } from 'react'
import { db } from '@/utils/db'
import { DocumentVersions } from '@/utils/schema'
import { eq, desc } from 'drizzle-orm'
import { Clock, FileText } from 'lucide-react'

interface Version {
  id: number;
  documentId: string;
  version: number;
  content: string;
  createdBy: string;
  createdAt: string;
  changeDescription: string;
}

interface Props {
  documentId: string;
  onVersionSelect: (content: string, version: number) => void;
  currentContent: string;
}

function VersionHistory({ documentId, onVersionSelect, currentContent }: Props) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVersion, setCurrentVersion] = useState<number>(1);

  // Load versions for this document
  useEffect(() => {
    const loadVersions = async () => {
      try {
        const res: any = await db.query.DocumentVersions.findMany({
          where: (row: any, { eq }:any) => eq(row.documentId, documentId),
          orderBy: (row:any, { desc }:any) => desc(row.version)
        } as any);
        
        setVersions(res || []);
        if (res && res.length > 0) {
          setCurrentVersion(res[0].version);
        }
      } catch (error) {
        console.error('Failed to load versions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadVersions();
  }, [documentId]);

  // Save new version when content changes
  const saveVersion = async (content: string, description: string = 'Content updated') => {
    try {
      const newVersion = currentVersion + 1;
      const result = await db.insert(DocumentVersions).values({
        documentId: documentId,
        version: newVersion,
        content: content,
        createdBy: 'current-user', // You can get this from context
        createdAt: new Date().toISOString(),
        changeDescription: description
      });
      
      // Reload versions
      const res: any = await db.query.DocumentVersions.findMany({
        where: (row: any, { eq }:any) => eq(row.documentId, documentId),
        orderBy: (row:any, { desc }:any) => desc(row.version)
      } as any);
      
      setVersions(res || []);
      setCurrentVersion(newVersion);
    } catch (error) {
      console.error('Failed to save version:', error);
    }
  };

  const handleVersionClick = (version: Version) => {
    onVersionSelect(version.content, version.version);
    setCurrentVersion(version.version);
  };

  if (loading) {
    return (
      <div className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4" />
          <h3 className="font-medium text-sm">Version History</h3>
        </div>
        <div className="text-xs text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4" />
        <h3 className="font-medium text-sm">Version History</h3>
      </div>
      
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {versions.length === 0 ? (
          <div className="text-xs text-gray-500">No versions yet</div>
        ) : (
          versions.map((version) => (
            <div
              key={version.id}
              onClick={() => handleVersionClick(version)}
              className={`p-2 rounded cursor-pointer text-xs border transition-colors ${
                version.version === currentVersion
                  ? 'bg-gray-100 border-gray-300 text-gray-800'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-3 h-3" />
                <span className="font-medium">Version {version.version}</span>
                {version.version === currentVersion && (
                  <span className="text-gray-600 text-xs">(Current)</span>
                )}
              </div>
              <div className="text-gray-600 mb-1">
                {version.changeDescription}
              </div>
              <div className="text-gray-500">
                {new Date(version.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Save current content as new version button */}
      {currentContent && currentContent.trim() && (
        <button
          onClick={() => saveVersion(currentContent, 'Manual save')}
          className="w-full mt-3 px-3 py-2 bg-gray-800 text-white text-xs rounded hover:bg-gray-700 transition-colors"
        >
          Save Current as New Version
        </button>
      )}
    </div>
  );
}

export default VersionHistory;

