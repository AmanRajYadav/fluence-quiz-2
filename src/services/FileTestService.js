// FileTestService.js - Test actual file loading
class FileTestService {
  static async testFileAccess() {
    console.log('🧪 Testing file access...');
    
    // Test the exact file we know exists
    const testPaths = [
      '/data/classes/class6/science/materials-around-us.json',
      'data/classes/class6/science/materials-around-us.json',
      './data/classes/class6/science/materials-around-us.json',
      process.env.PUBLIC_URL + '/data/classes/class6/science/materials-around-us.json',
      window.location.origin + '/data/classes/class6/science/materials-around-us.json'
    ];
    
    for (const path of testPaths) {
      try {
        console.log(`🔍 Testing path: ${path}`);
        const response = await fetch(path);
        
        console.log(`📊 Response:`, {
          url: path,
          status: response.status,
          ok: response.ok,
          contentType: response.headers.get('content-type'),
          statusText: response.statusText
        });
        
        if (response.ok) {
          const text = await response.text();
          console.log(`📄 First 100 chars of response:`, text.substring(0, 100));
          
          // Check if it's HTML (404 page) or JSON
          if (text.trim().startsWith('{')) {
            console.log('✅ SUCCESS! This path returns JSON:', path);
            try {
              const json = JSON.parse(text);
              console.log('🎯 JSON parsed successfully:', {
                hasQuestions: !!json.questions,
                questionCount: json.questions?.length,
                chapterName: json.chapterInfo?.chapterName
              });
              return { path, data: json };
            } catch (e) {
              console.log('❌ JSON parse error:', e.message);
            }
          } else {
            console.log('❌ This path returns HTML (404):', path);
          }
        }
      } catch (error) {
        console.log(`❌ Fetch error for ${path}:`, error.message);
      }
    }
    
    return null;
  }
  
  static async findWorkingPath(classId, subjectId, chapterId) {
    console.log(`🎯 Finding working path for: class${classId}/${subjectId}/${chapterId}`);
    
    // Generate all possible paths
    const basePaths = [
      '',
      '/',
      './',
      process.env.PUBLIC_URL || '',
      window.location.origin
    ];
    
    const patterns = [
      `data/classes/class${classId}/${subjectId}/${chapterId}.json`,
      `data/classes/class${classId}/${subjectId}/all-chapters.json`,
      `data/classes/class${classId}/combined.json`
    ];
    
    for (const base of basePaths) {
      for (const pattern of patterns) {
        const fullPath = base + (base && !base.endsWith('/') && !pattern.startsWith('/') ? '/' : '') + pattern;
        
        try {
          console.log(`🔍 Trying: ${fullPath}`);
          const response = await fetch(fullPath);
          
          if (response.ok) {
            const text = await response.text();
            if (text.trim().startsWith('{')) {
              console.log('✅ FOUND WORKING PATH:', fullPath);
              const json = JSON.parse(text);
              return { path: fullPath, data: json };
            }
          }
        } catch (error) {
          // Silent fail, continue testing
        }
      }
    }
    
    console.log('❌ No working path found');
    return null;
  }
}

export default FileTestService; 