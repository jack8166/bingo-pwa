function fetchBingo() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}${mm}${dd}`;
  const url = `/api/bingo/${dateStr}`;

  fetch(url)
    .then(res => res.text())
    .then(html => {
      const matches = html.match(/\d{4}\/\d{2}\/\d{2} 第\d+期：(\d{2}、){19}\d{2}/g);
      if (!matches) return document.getElementById("result").textContent = "尚未有資料";
      
      const stored = JSON.parse(localStorage.getItem("bingo") || "[]");
      const newOnes = matches.filter(m => !stored.includes(m));
      localStorage.setItem("bingo", JSON.stringify([...stored, ...newOnes]));

      const numbers = {};
      newOnes.forEach(line => {
        line.match(/\d{2}/g).forEach(num => {
          numbers[num] = (numbers[num] || 0) + 1;
        });
      });

      const sorted = Object.entries(numbers).sort((a, b) => b[1] - a[1]);
      const summary = sorted.map(([n, c]) => `${n}：${c} 次`).join('\n');

      const output = newOnes.join('\n') + '\n\n【號碼統計】\n' + summary;
      document.getElementById("result").textContent = output;
      navigator.clipboard.writeText(output);
      alert("擷取完成，已複製結果！");
    })
    .catch(err => {
      document.getElementById("result").textContent = "讀取失敗：" + err;
    });
}