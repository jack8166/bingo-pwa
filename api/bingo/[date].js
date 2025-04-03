export default async function handler(req, res) {
  const { date } = req.query;
  const targetUrl = `https://lotto.auzonet.com/bingobingo/list_${date}.html`;

  try {
    const response = await fetch(targetUrl);
    const html = await response.text();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send("代理失敗：" + error.toString());
  }
}
