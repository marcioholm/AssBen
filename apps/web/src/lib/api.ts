const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        throw new Error(error.message || 'Erro na requisição');
    }

    return response.json();
}

export const api = {
    auth: {
        adminLogin: (dto: any) => apiFetch('/auth/admin/login', { method: 'POST', body: JSON.stringify(dto) }),
        beneficiaryLogin: (dto: any) => apiFetch('/auth/beneficiary/login', { method: 'POST', body: JSON.stringify(dto) }),
    },
    validation: {
        generateQr: () => apiFetch('/validation/qr/generate', { method: 'POST' }),
        validateQr: (dto: any) => apiFetch('/validation/qr/validate', { method: 'POST', body: JSON.stringify(dto) }),
        validateCpfPin: (dto: any) => apiFetch('/validation/cpf-pin/validate', { method: 'POST', body: JSON.stringify(dto) }),
    },
    beneficiaries: {
        changePin: (dto: any) => apiFetch('/beneficiaries/change-pin', { method: 'POST', body: JSON.stringify(dto) }),
        bulkCreate: (dto: any) => apiFetch('/beneficiaries/bulk', { method: 'POST', body: JSON.stringify(dto) }),
    },
    partners: {
        findAll: () => apiFetch('/partners'),
        update: (id: string, dto: any) => apiFetch(`/partners/${id}`, { method: 'PATCH', body: JSON.stringify(dto) }),
    },
    revalidations: {
        getPending: () => apiFetch('/revalidations/pending'),
        bulkRevalidate: (dto: any) => apiFetch('/revalidations/bulk-revalidate', { method: 'POST', body: JSON.stringify(dto) }),
        bulkInactivate: (dto: any) => apiFetch('/revalidations/bulk-inactivate', { method: 'POST', body: JSON.stringify(dto) }),
    }
};
