import fs from 'fs';
import path from 'path';

export interface ChangelogVersion {
  version: string;
  title: string;
  date: string;
  emoji: string;
  features: string[];
  content: string; // 完整的原始内容
}

export interface ChangelogData {
  title: string;
  description: string;
  versions: ChangelogVersion[];
}

const parseMarkdownChangelog = (content: string): ChangelogData => {
  const lines = content.split('\n');
  
  let title = '';
  let description = '';
  const versions: ChangelogVersion[] = [];
  
  let currentVersion: Partial<ChangelogVersion> = {};
  let currentVersionContent: string[] = [];
  let versionStartIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Extract main title
    if (trimmedLine.startsWith('# ') && !title) {
      title = trimmedLine.substring(2);
      continue;
    }
    
    // Extract description (first paragraph after title)
    if (!description && trimmedLine && !trimmedLine.startsWith('#') && !trimmedLine.startsWith('##')) {
      description = trimmedLine;
      continue;
    }
    
    // Extract version headers (## v1.6.3...)
    if (trimmedLine.startsWith('## v')) {
      // Save previous version if exists
      if (currentVersion.version && versionStartIndex !== -1) {
        const versionEndIndex = i - 1;
        const versionLines = lines.slice(versionStartIndex, versionEndIndex + 1);
        const versionContent = versionLines.join('\n').trim();
        
        versions.push({
          ...currentVersion,
          content: versionContent,
          features: extractFeatures(versionContent),
        } as ChangelogVersion);
      }
      
      // Parse version line: ## v1.6.3 (2025-09-05) - Latest
      const versionMatch = trimmedLine.match(/^## (v[\d.]+)\s+\(([^)]+)\)(?:\s*-\s*(.*))?/);
      if (versionMatch) {
        currentVersion = {
          version: versionMatch[1],
          date: versionMatch[2],
          title: '', // Will be filled by the next ### line
          emoji: '',
          features: [],
          content: '',
        };
        versionStartIndex = i;
      }
      continue;
    }
    
    // Extract version title (### 🚀 Title...)
    if (trimmedLine.startsWith('### ') && currentVersion.version && !currentVersion.title) {
      const titleMatch = trimmedLine.match(/^### (.+)/);
      if (titleMatch) {
        const fullTitle = titleMatch[1];
        // Extract emoji and title
        const emojiMatch = fullTitle.match(/^(\S+)\s+(.+)/);
        if (emojiMatch) {
          currentVersion.emoji = emojiMatch[1];
          currentVersion.title = emojiMatch[2];
        } else {
          currentVersion.emoji = '📱';
          currentVersion.title = fullTitle;
        }
      }
      continue;
    }
  }
  
  // Add the last version
  if (currentVersion.version && versionStartIndex !== -1) {
    const versionLines = lines.slice(versionStartIndex);
    const versionContent = versionLines.join('\n').trim();
    
    versions.push({
      ...currentVersion,
      content: versionContent,
      features: extractFeatures(versionContent),
    } as ChangelogVersion);
  }
  
  return {
    title,
    description,
    versions,
  };
};

// 提取功能点的辅助函数
const extractFeatures = (content: string): string[] => {
  const features: string[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // 匹配简单的 bullet points
    if (trimmedLine.startsWith('• ')) {
      features.push(trimmedLine.substring(2));
    }
    // 匹配带子项的功能点 (e.g., • **🚀 Complete Focus Mode Overhaul:**)
    else if (trimmedLine.match(/^• \*\*[^:]+:\*\*/)) {
      features.push(trimmedLine.substring(2));
    }
  }
  
  return features;
};

export const getChangelog = (locale: string): ChangelogData => {
  try {
    const changelogPath = path.join(process.cwd(), 'changelogs', `${locale}.md`);
    
    if (!fs.existsSync(changelogPath)) {
      // Fallback to English if the requested locale doesn't exist
      const fallbackPath = path.join(process.cwd(), 'changelogs', 'en.md');
      if (fs.existsSync(fallbackPath)) {
        const content = fs.readFileSync(fallbackPath, 'utf8');
        return parseMarkdownChangelog(content);
      }
      
      // Return empty changelog if no files exist
      return {
        title: 'Changelog',
        description: 'Release notes and updates',
        versions: [],
      };
    }
    
    const content = fs.readFileSync(changelogPath, 'utf8');
    return parseMarkdownChangelog(content);
  } catch (error) {
    console.error('Error reading changelog:', error);
    return {
      title: 'Changelog',
      description: 'Release notes and updates',
      versions: [],
    };
  }
};