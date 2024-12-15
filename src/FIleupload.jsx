import React, { useState, useEffect } from 'react';

function FileUploader() {
  const [notes, setNotes] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  // 加载笔记数据
  useEffect(() => {
    // 获取笔记文件
    console.log('完蛋了')
    window.electron.readNotes().then((data) => setNotes(data));
  }, []);

  // 保存笔记数据
  useEffect(() => {
    if (notes.length > 0) {
      // 写入笔记文件
      window.electron.writeNotes(notes);
    }
  }, [notes]);

  // 处理文件上传
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert('请选择一个文件！');
      return;
    }

    if (file.type !== 'text/plain') {
      alert('请上传一个TXT文件！');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result;
      const lines = content.split('\n').map((line) => line.trim()).filter((line) => line);

      if (lines.length === 0) {
        alert('文件内容为空！');
        return;
      }

      setNotes(lines); // 更新笔记
    };

    reader.onerror = () => {
      console.error('文件读取失败:', reader.error);
      alert('文件读取失败，请重试！');
    };

    reader.readAsText(file);
  };

  // 处理搜索和清除功能
  const handleSearchAndRemove = () => {
    if (!searchValue) {
      alert('请输入关键词！');
      return;
    }

    const filteredNotes = notes.filter(
      (note) => !note.toLowerCase().includes(searchValue.toLowerCase())
    );

    if (filteredNotes.length !== notes.length) {
      alert(`成功清除包含关键词：${searchValue} 的记录`);
    } else {
      alert('未找到匹配记录！');
    }

    setNotes(filteredNotes); // 更新笔记
  };

  return (
    <div>
      <input type="file" id="fileInput" accept=".txt" onChange={handleFileUpload} />
      <input
        type="text"
        id="searchInput"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="请输入要查找的关键词"
      />
      <button id="searchAndRemove" onClick={handleSearchAndRemove}>
        查找并清除
      </button>
      <ul id="noteList">
        {notes.length === 0 ? (
          <li>暂无记录</li>
        ) : (
          notes.map((note, index) => <li key={index}>{`${index + 1}. ${note}`}</li>)
        )}
      </ul>
    </div>
  );
}

export default FileUploader;
