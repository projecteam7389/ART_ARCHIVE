import { supabase, escapeHTML, won } from "./common.js";

const list = document.querySelector("#art-list");
const category = document.querySelector('#category');
const search = document.querySelector('#search');
let artworks = [];

function showGallery() {
    const keyword = search.value.trim().toLowerCase();
    //빈문자열 제거(trim), 텍스트 소문자 변환(toLowerCase)
    const selected = category.value;
    list.innerHTML = '';
    let found = 0;

    artworks.forEach((art) => {
        //전체, 카테고리가 다르면 건너뜀
        if (selected !== '전체' && art.category !== selected) return;

        //제목이나 작가명에 맞는 검색어가 없으면 건너뜀
        const title = String(art.title || '').toLowerCase();
        const artist = String(art.artist || '').toLowerCase();
        if (!title.includes(keyword) && !artist.includes(keyword)) return;

        found += 1;
        let image = '<div class="no-image">ART WORKS</div>';
        if (art.image_url) {
            image = `
                <img src="${escapeHTML(art.image_url)}" alt="${escapeHTML(art.title)}">
            `;
        }

        list.innerHTML += `
            <a class="art-card" href="detail.html?id=${encodeURIComponent(art.id)}">${image}
                <div class="art-info">
                    <span class="muted">${escapeHTML(art.category)}</span>
                    <p>${escapeHTML(art.artist)}</p>
                     <h3>${escapeHTML(art.title)}</h3>
                     <p class="desc">${escapeHTML(art.description)}</p>
                     <strong>구매 ${won(art.price)}</strong>
                     <small>월 대여 ${won(art.rental_price)}</small>
                </div>
             </a>
        `;
    })

    //검색 조건에 맞는 작품 개수를 화면에 출력
    const resultCount = document.querySelector('#result-count');
    resultCount.textContent = `검색결과: ${found}개`;

    if (found === 0) list.textContent = '검색 결과가 없습니다.'
}

//supabase에서 작품 목록 조회
async function loadGallery() {
    const { data, error } = await supabase
        .from('ART ARCHIVE')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        true.textContent = '조회 오류: ' + error.message;
        return;
    }
    artworks = data;
    showGallery();
}

//입력이 바뀌면 목록 재출력
category.addEventListener('change', showGallery)
search.addEventListener('input', showGallery)
loadGallery();