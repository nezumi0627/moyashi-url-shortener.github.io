document.addEventListener('DOMContentLoaded', () => {
    const originalUrlInput = document.getElementById('originalUrl');
    const shortenButton = document.getElementById('shortenButton');
    const resultDiv = document.getElementById('result');
    const shortenedUrlInput = document.getElementById('shortenedUrl');
    const copyButton = document.getElementById('copyButton');
    const messageDiv = document.getElementById('message');

    /**
     * URLを短縮するAPI呼び出しを行う
     * @param {string} url - 短縮したい元のURL
     * @returns {Promise<string>} 短縮されたURL
     */
    async function shortenUrl(url) {
        try {
            const response = await fetch('https://moyashi.xyz/api/short', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ url })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'URLの短縮に失敗しました');
            }

            const data = await response.json();
            if (!data.shortened_url) {
                throw new Error('不正なレスポンス形式です');
            }

            return data.shortened_url;
        } catch (error) {
            if (error.name === 'TypeError') {
                throw new Error('ネットワークエラーが発生しました');
            }
            throw error;
        }
    }

    /**
     * メッセージを表示する
     * @param {string} text - 表示するメッセージ
     * @param {string} type - メッセージの種類 ('error' | 'success')
     */
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = type;
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = '';
        }, 3000);
    }

    // 短縮ボタンのクリックイベント
    shortenButton.addEventListener('click', async () => {
        const url = originalUrlInput.value.trim();
        
        if (!url) {
            showMessage('URLを入力してください', 'error');
            return;
        }

        try {
            const shortenedUrl = await shortenUrl(url);
            shortenedUrlInput.value = shortenedUrl;
            resultDiv.classList.add('active');
            showMessage('URLを短縮しました', 'success');
        } catch (error) {
            showMessage(error.message, 'error');
        }
    });

    // コピーボタンのクリックイベント
    copyButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(shortenedUrlInput.value);
            showMessage('URLをコピーしました', 'success');
        } catch (error) {
            showMessage('コピーに失敗しました', 'error');
        }
    });

    // Enterキーでの送信
    originalUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            shortenButton.click();
        }
    });
}); 