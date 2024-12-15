import React, { useState, useEffect } from 'react';

function FileUploader() {
  const [notes, setNotes] = useState([]);
  const [isClearing, setIsClearing] = useState(false); // 控制清除的状态
  const [intervalId, setIntervalId] = useState(null); // 存储 setInterval 的 ID，以便停止

  // 加载笔记数据
  useEffect(() => {
    window.electron.readNotes().then((data) => setNotes(data));
  }, []);

  // 保存笔记数据
  useEffect(() => {
    if (notes.length > 0) {
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

  // 处理清除功能
  const handleClearNotes = () => {
    // 如果正在清除，则停止清除
    if (isClearing) {
      clearInterval(intervalId); // 停止定时器
      setIsClearing(false); // 设置状态为停止清除
      return;
    }

    // 启动清除过程
    setIsClearing(true);
    let currentIndex = 0;

    const id = setInterval(() => {
      if (currentIndex < notes.length) {
        currentIndex++;
        setNotes((prevNotes) => prevNotes.filter((_, i) => i !== currentIndex - 1)); // 移除当前记录
      } else {
        clearInterval(id); // 清除定时器
        setIsClearing(false);
      }
    }, 2000); // 每隔2秒清除一个记录

    setIntervalId(id); // 保存定时器ID
  };

  return (
    <div>
      <input type="file" id="fileInput" accept=".txt" onChange={handleFileUpload} />
      <button id="searchAndRemove" onClick={handleClearNotes}>
        {isClearing ? '停止清除' : '开始清除'}
      </button>

      {/* 显示总记录数 */}
      <div>
        <strong>总记录数：{notes.length}</strong>
      </div>

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
