import { supabase, escapeHTML, won } from './common.js';

const status = document.querySelector('#detail-status');
const content = document.querySelector('#artwork-content');
const image = document.querySelector('#artwork-image');
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

function showMessage(message) {
    status.textContent = message;
    content.hidden = true;
}

async function loadArtwork() {
    if (!id || !/^\d+$/.test(id)) {
        showMessage('올바른 작품 ID가 없습니다.');
        return;
    }

    const { data: artwork, error } = await supabase
        .from('ART ARCHIVE')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (error) {
        console.error('작품 상세 조회 오류:', error);
        showMessage('작품 정보를 불러오지 못했습니다: ' + error.message);
        return;
    }

    if (!artwork) {
        showMessage('해당 작품을 찾을 수 없습니다.');
        return;
    }

    document.querySelector('#artwork-title').textContent = artwork.title || '제목 없음';
    document.querySelector('#artwork-artist').textContent = artwork.artist || '작가 미상';
    document.querySelector('#artwork-category').textContent = artwork.category || '';
    document.querySelector('#artwork-description').textContent =
        artwork.description || '등록된 작품 설명이 없습니다.';
    document.querySelector('#artwork-price').textContent = won(artwork.price);
    document.querySelector('#artwork-rental-price').textContent = won(artwork.rental_price);

    if (artwork.image_url) {
        image.innerHTML = `<img src="${escapeHTML(artwork.image_url)}" alt="${escapeHTML(artwork.title || '작품 이미지')}">`;
    } else {
        image.innerHTML = '<div class="no-image">ART WORKS</div>';
    }

    document.title = `${artwork.title || '작품 상세'} || ART ARCHIVE`;
    status.hidden = true;
    content.hidden = false;
}

loadArtwork();
