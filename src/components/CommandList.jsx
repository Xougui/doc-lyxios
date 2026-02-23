import { useState, useEffect } from 'react';

export default function CommandList() {
    const [commands, setCommands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('https://api-lyxios.xouxou-hosting.fr/api/v1/public/commands')
            .then((res) => res.ok ? res.json() : Promise.reject(`Erreur HTTP ${res.status}`))
            .then((data) => {
                if (Array.isArray(data)) {
                    setCommands(data);
                } else if (data.status === 'success' && Array.isArray(data.commands)) {
                    setCommands(data.commands);
                } else {
                    console.warn('⚠️ API Commands : Format de réponse inattendu.', data);
                    setCommands([]);
                }
                setLoading(false);
            })
            .catch((e) => {
                console.error('Erreur lors de la récupération des commandes:', e);
                setError(true);
                setLoading(false);
            });
    }, []);

    // Mise à jour de la Table des Matières (ToC) de Starlight après le chargement
    useEffect(() => {
        if (!loading && !error && commands.length > 0) {
            setTimeout(() => {
                const tocContainer = document.querySelector('starlight-toc nav > ul') || document.querySelector('.right-sidebar nav > ul');
                if (tocContainer) {
                    // Nettoyer les anciennes entrées dynamiques si nécessaire ou éviter les doublons
                    // Ici on ajoute simplement comme dans le script original
                    const categories = document.querySelectorAll('.category-section h2');
                    categories.forEach((heading) => {
                        // Vérifier si le lien existe déjà pour éviter les doublons lors des re-renders
                        if (!tocContainer.querySelector(`a[href="#${heading.id}"]`)) {
                            const li = document.createElement('li');
                            const a = document.createElement('a');
                            a.href = `#${heading.id}`;
                            a.textContent = heading.textContent;
                            li.appendChild(a);
                            tocContainer.appendChild(li);
                        }
                    });
                }
            }, 100); // Petit délai pour s'assurer que le DOM est prêt
        }
    }, [loading, error, commands]);

    const slugify = (text) => {
        return text
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    // Traitement des données : Nettoyage, Groupement et Filtrage
    const processCommands = () => {
        const grouped = {};
        const term = searchTerm.toLowerCase();

        commands.forEach((cmd) => {
            // Nettoyage du nom
            const match = cmd.name.match(/<\/([^:]+):/);
            const cleanName = match ? `/${match[1]}` : cmd.name;
            const cleanCmd = { ...cmd, name: cleanName };

            // Filtrage (Recherche)
            if (term && !cleanName.toLowerCase().includes(term) && !cmd.description.toLowerCase().includes(term)) {
                return;
            }

            const category = cmd.categorie || 'Autres';
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(cleanCmd);
        });

        return Object.keys(grouped).sort().map(category => ({
            category,
            slug: slugify(category),
            cmds: grouped[category]
        }));
    };

    const filteredGroups = processCommands();

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--sl-color-bg-nav)', borderRadius: '8px', marginTop: '1rem' }}><p>Chargement des commandes...</p></div>;
    if (error) return <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--sl-color-bg-nav)', borderRadius: '8px', marginTop: '1rem' }}><p>Impossible de charger la liste des commandes pour le moment.</p></div>;

    return (
        <div className="command-list-container">
            <div className="search-wrapper">
                <input 
                    type="text" 
                    id="command-search" 
                    placeholder="Rechercher une commande..." 
                    aria-label="Rechercher une commande"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredGroups.map((group) => (
                <div className="category-section" key={group.category}>
                    <h2 id={group.slug} className="category-title">{group.category}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '40%' }}>Commande</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody className="command-group">
                            {group.cmds.map((cmd, index) => (
                                <tr className="command-row" key={index}>
                                    <td>
                                        <div className="cmd-name-wrapper">
                                            <code>{cmd.name}</code>
                                            {cmd.params && cmd.params.length > 0 && (
                                                <span className="cmd-params">
                                                    {cmd.params.map((p, i) => <span key={i} className="param-tag">{p}</span>)}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>{cmd.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}

            {filteredGroups.length === 0 && (
                <p className="empty-message">Aucun résultat trouvé.</p>
            )}
        </div>
    );
}