import { fetchFirmaById } from "./veri";

// Firma ID'sini belirtin
const firmaId = "burayaFirmaIdGirin"; // Örnek firma ID'si

// fetchFirmaById fonksiyonunu kullanarak firma verilerini çekin
const firmaData = await fetchFirmaById(firmaId);

// firmaData'dan gerekli bilgileri çıkarın
const ad = firmaData?.ad || "";
const adres = firmaData?.adres || "";
const firma = firmaData?.firma || "";
const tel = firmaData?.tel || "";

export { ad, adres, firma, tel };