import {TYPES, CONTENT, TOPICS, METHODS, BASE_COUNTRIES, LANGUAGES, COUNTRY_CODES} from './data.js';
import {LABELS} from './i18n.js';

// Account data stays in an HttpOnly, same-origin session. This module never stores
// credentials or pretends a local form submission has reached the service.
const COPY = {
  en: {
    community:'The ID-EBP community', account:'Your account', members:'Member workspace', sourceWorkspace:'Your sources', admin:'Administration',
    login:'Sign in', register:'Join the community', signOut:'Sign out', loading:'Checking the account service…',
    intro:'Help other people find useful research, practice and ideas. Add searchable tags, rate sources and manage the sources you represent.',
    loginIntro:'Use your email address. We will send a one-time code so you can sign in without a password.',
    registerIntro:'Create a member account to add tags and rate sources. If you represent a listed source, you can also request access to its profile.',
    setupTitle:'Account activation required', setupBody:'The account screens are ready to review. Email sign-in and shared contributions become available when the secure account service is connected. Nothing entered here is submitted while it is inactive.',
    setupShort:'Shared contributions are available when the account service is connected.', serviceUnavailable:'The account service could not be reached. Try again shortly.',
    email:'Email address', name:'Your name', nameHint:'Your account name is not a public source contact.', sendCode:'Send my sign-in code', sending:'Sending…',
    codeTitle:'Check your email', codeBody:'Enter the one-time code sent to {email}.', code:'Email verification code', verify:'Verify email and sign in',
    changeEmail:'Use another email address', resend:'Send another code', privacy:'Your sign-in email stays private. It is used to secure your account and check source ownership.',
    already:'Already a member?', create:'Create an account', accountOverview:'Your membership', confirmed:'Email confirmed', unconfirmed:'Email not confirmed',
    emailRequirement:'Confirm your email before making shared contributions or requesting source access.',
    memberBenefits:'Make the directory more useful', tagsBenefit:'Add searchable community tags', ratingsBenefit:'Rate sources from 0 to 5 stars', sourcesBenefit:'Manage a source you represent',
    browse:'Browse the sources', addTags:'Open a source profile to suggest a tag or give it a rating.',
    sourceIntro:'Manage your source block after confirming an approved contact email or completing an ownership review.',
    managed:'Sources you manage', noManaged:'You do not manage any sources yet.', findSource:'Find your source', selectSource:'Choose a listed source',
    claim:'Request source access', claimHint:'Use the source’s approved contact email. Other organisation addresses are checked by an administrator.',
    claimRequested:'Your request has been received. Access is confirmed for the source’s approved contact email; other requests are checked by an administrator.',
    signInRequired:'Sign in to contribute', signInClaim:'Sign in using your source email address to request management access.',
    claimSource:'Request access to this source', claimSelected:'Source selected', claims:'Your source requests', pending:'Awaiting review', approved:'Approved', rejected:'Not approved',
    edit:'Edit source details', sourceName:'Source name', publisher:'Organisation or author', description:'Source description', descriptionHint:'Describe the source, rather than translating or reproducing its research. Maximum 600 characters.',
    topics:'Topics', methods:'Research methods', content:'What this source provides', choose:'Select any that apply', submitRevision:'Submit changes for review',
    revisionHelp:'Changes are reviewed before they appear publicly. Source access does not bypass the checks used for every listing.',
    revisionSubmitted:'Your proposed changes have been saved for administrator review.', website:'Website', country:'Country', languages:'Source languages',
    communityTitle:'Help others find this source', communityIntro:'Members can add searchable tags and rate this source. Tags are checked before publication.',
    aggregateEmpty:'Not rated yet', aggregate:'{average} out of 5 · {count} ratings', yourRating:'Your rating', ratingHint:'Choose 0–5 stars. Zero is a rating; leaving the source unrated is different.',
    zeroStars:'0 stars', stars:'{count} stars', saveRating:'Save rating', removeRating:'Remove my rating', ratingSaved:'Your rating has been saved.', ratingRemoved:'Your rating has been removed.',
    ratingMissing:'Choose a rating from 0 to 5.', tagLabel:'Suggest a searchable tag', tagPlaceholder:'For example, neighbourhood policing', tagHint:'Use a short topic, method or subject. Do not include personal information.',
    submitTag:'Submit tag', tagSubmitted:'Your tag has been submitted for review. It will become searchable when approved.', tags:'Community tags', noTags:'No community tags have been approved yet.',
    verifiedDomain:'Approved source contact confirmed', verifiedOrganisation:'Organisation confirmed', notVerified:'Source ownership not yet verified',
    ratingRank:'Community ratings and verified source ownership contribute to source rankings. They do not establish the quality of individual research studies.',
    contributions:'Your contributions', noContributions:'Your submitted tags will appear here.', status:'Status', openProfile:'Open public profile',
    adminIntro:'Review source requests, proposed profile changes and community tags. Approval is recorded and published through the account service.',
    adminOnly:'Administrator access is required.', adminLogin:'Sign in with an administrator account to open the review queue.',
    reviewQueue:'Review queue', noReviews:'There is nothing awaiting review.', tagReview:'Community tags', claimReview:'Source access requests', revisionReview:'Profile changes',
    approve:'Approve', reject:'Reject', reason:'Review note', reasonHint:'Explain the decision. This note is recorded with the review.', decisionSaved:'The review decision has been recorded.',
    source:'Source', submittedBy:'Submitted by', proposed:'Proposed details', viewSource:'View source', refresh:'Refresh',
    requestError:'We could not complete that request. Please try again.', rateLimited:'Too many requests. Please wait before trying again.',
    invalidCode:'That code is invalid or has expired. Request another code and try again.', invalidEmail:'Enter a valid email address.',
    unauthorised:'Your session has ended. Sign in again.', forbidden:'Your account does not have access to this action.',
    csrf:'Please refresh this page, then try again.', badRequest:'Please check the details you entered.', domainMismatch:'Your email domain could not establish source ownership. Your request needs administrator review.',
    sourceUnavailable:'This source could not be found.', saved:'Saved', back:'Back to your sources', ownRating:'Your current rating: {count} out of 5',
    claimState:'{source} · {state}', editorAdded:'Listed source', activation:'Activation', memberNavigation:'Member navigation',
    publicTags:'Approved tags are public and searchable. Your email is never included.', editUnavailable:'Source details are not available in this version of the catalogue.',
    available:'Available', closed:'Not connected', optional:'Optional', newSource:'Suggest a source', newSourceIntro:'Know a useful source that is missing? Submit its public website for review.',
    submitSource:'Submit source for review', sourceSubmitted:'Your source suggestion has been saved for review.', sourceReview:'New source suggestions',
  },
  fr: {
    community:'La communauté ID-EBP', account:'Votre compte', members:'Espace membre', sourceWorkspace:'Vos sources', admin:'Administration',
    login:'Se connecter', register:'Rejoindre la communauté', signOut:'Se déconnecter', loading:'Vérification du service de comptes…',
    intro:'Aidez chacun à trouver des recherches, des pratiques et des idées utiles. Ajoutez des mots-clés, évaluez les sources et gérez celles que vous représentez.',
    loginIntro:'Utilisez votre adresse électronique. Nous vous enverrons un code à usage unique pour vous connecter sans mot de passe.',
    registerIntro:'Créez un compte membre pour ajouter des mots-clés et évaluer les sources. Si vous représentez une source, vous pouvez demander à gérer sa fiche.',
    setupTitle:'Activation des comptes nécessaire', setupBody:'Les écrans peuvent être consultés. La connexion par courriel et les contributions partagées seront disponibles lorsque le service sécurisé sera connecté. Aucune saisie n’est envoyée tant qu’il est inactif.',
    setupShort:'Les contributions partagées seront disponibles lorsque le service de comptes sera connecté.', serviceUnavailable:'Le service de comptes est inaccessible. Réessayez dans un instant.',
    email:'Adresse électronique', name:'Votre nom', nameHint:'Le nom de votre compte n’est pas un contact public de la source.', sendCode:'Envoyer mon code de connexion', sending:'Envoi…',
    codeTitle:'Consultez votre messagerie', codeBody:'Saisissez le code à usage unique envoyé à {email}.', code:'Code de vérification', verify:'Vérifier et se connecter',
    changeEmail:'Utiliser une autre adresse', resend:'Envoyer un autre code', privacy:'Votre adresse de connexion reste privée. Elle protège votre compte et permet de vérifier votre lien avec une source.',
    already:'Déjà membre ?', create:'Créer un compte', accountOverview:'Votre adhésion', confirmed:'Adresse confirmée', unconfirmed:'Adresse non confirmée',
    emailRequirement:'Confirmez votre adresse avant de contribuer ou de demander la gestion d’une source.',
    memberBenefits:'Améliorez l’utilité de l’annuaire', tagsBenefit:'Ajouter des mots-clés recherchables', ratingsBenefit:'Évaluer les sources de 0 à 5 étoiles', sourcesBenefit:'Gérer une source que vous représentez',
    browse:'Parcourir les sources', addTags:'Ouvrez une fiche pour proposer un mot-clé ou évaluer une source.',
    sourceIntro:'Gérez votre fiche après confirmation d’une adresse de contact approuvée ou examen de votre demande.',
    managed:'Sources que vous gérez', noManaged:'Vous ne gérez encore aucune source.', findSource:'Trouvez votre source', selectSource:'Choisir une source répertoriée',
    claim:'Demander la gestion', claimHint:'Utilisez l’adresse de contact approuvée de la source. Les autres adresses institutionnelles sont examinées par l’administration.',
    claimRequested:'Votre demande a été reçue. L’accès est confirmé avec l’adresse de contact approuvée de la source ; les autres demandes sont examinées par l’administration.',
    signInRequired:'Connectez-vous pour contribuer', signInClaim:'Connectez-vous avec l’adresse de votre source pour demander sa gestion.',
    claimSource:'Demander la gestion de cette source', claimSelected:'Source sélectionnée', claims:'Vos demandes de gestion', pending:'En attente', approved:'Approuvé', rejected:'Non approuvé',
    edit:'Modifier la fiche', sourceName:'Nom de la source', publisher:'Organisation ou auteur', description:'Description de la source', descriptionHint:'Décrivez la source sans traduire ni reproduire ses recherches. 600 caractères maximum.',
    topics:'Thèmes', methods:'Méthodes de recherche', content:'Contenus proposés', choose:'Sélectionnez les éléments pertinents', submitRevision:'Soumettre les modifications',
    revisionHelp:'Les modifications sont examinées avant publication. La gestion d’une source ne dispense pas des vérifications communes à toutes les fiches.',
    revisionSubmitted:'Vos modifications ont été enregistrées pour examen.', website:'Site web', country:'Pays', languages:'Langues de la source',
    communityTitle:'Aidez à trouver cette source', communityIntro:'Les membres peuvent ajouter des mots-clés et évaluer la source. Les mots-clés sont vérifiés avant publication.',
    aggregateEmpty:'Aucune évaluation', aggregate:'{average} sur 5 · {count} évaluations', yourRating:'Votre évaluation', ratingHint:'Choisissez de 0 à 5 étoiles. Zéro est une note ; l’absence de note est différente.',
    zeroStars:'0 étoile', stars:'{count} étoiles', saveRating:'Enregistrer la note', removeRating:'Retirer ma note', ratingSaved:'Votre note a été enregistrée.', ratingRemoved:'Votre note a été retirée.',
    ratingMissing:'Choisissez une note de 0 à 5.', tagLabel:'Proposer un mot-clé', tagPlaceholder:'Par exemple, police de proximité', tagHint:'Utilisez un thème, une méthode ou un sujet court, sans informations personnelles.',
    submitTag:'Soumettre le mot-clé', tagSubmitted:'Votre mot-clé sera recherchable après approbation.', tags:'Mots-clés de la communauté', noTags:'Aucun mot-clé approuvé pour le moment.',
    verifiedDomain:'Contact approuvé de la source confirmé', verifiedOrganisation:'Organisation confirmée', notVerified:'Gestion de la source non vérifiée',
    ratingRank:'Les évaluations et la vérification de gestion contribuent au classement des sources. Elles ne déterminent pas la qualité des études individuelles.',
    contributions:'Vos contributions', noContributions:'Vos mots-clés soumis apparaîtront ici.', status:'Statut', openProfile:'Voir la fiche publique',
    adminIntro:'Examinez les demandes de gestion, modifications et mots-clés. Les décisions sont enregistrées et publiées par le service de comptes.',
    adminOnly:'Accès administrateur nécessaire.', adminLogin:'Connectez-vous avec un compte administrateur pour ouvrir la file d’examen.',
    reviewQueue:'Éléments à examiner', noReviews:'Aucun élément en attente.', tagReview:'Mots-clés', claimReview:'Demandes de gestion', revisionReview:'Modifications de fiches',
    approve:'Approuver', reject:'Refuser', reason:'Note de décision', reasonHint:'Expliquez la décision. Cette note sera enregistrée.', decisionSaved:'La décision a été enregistrée.',
    source:'Source', submittedBy:'Soumis par', proposed:'Détails proposés', viewSource:'Voir la source', refresh:'Actualiser',
    requestError:'La demande n’a pas pu être traitée. Réessayez.', rateLimited:'Trop de demandes. Veuillez patienter.',
    invalidCode:'Ce code est invalide ou expiré. Demandez un nouveau code.', invalidEmail:'Saisissez une adresse valide.',
    unauthorised:'Votre session est terminée. Reconnectez-vous.', forbidden:'Votre compte ne peut pas effectuer cette action.',
    csrf:'Actualisez cette page, puis réessayez.', badRequest:'Vérifiez les informations saisies.', domainMismatch:'Votre domaine ne suffit pas à vérifier votre droit de gestion. Un examen est nécessaire.',
    sourceUnavailable:'Cette source est introuvable.', saved:'Enregistré', back:'Retour à vos sources', ownRating:'Votre note actuelle : {count} sur 5',
    claimState:'{source} · {state}', editorAdded:'Source répertoriée', activation:'Activation', memberNavigation:'Navigation membre',
    publicTags:'Les mots-clés approuvés sont publics et recherchables. Votre adresse n’est jamais incluse.', editUnavailable:'Les détails de cette source ne sont pas disponibles dans cette version de l’annuaire.',
    available:'Disponible', closed:'Non connecté', optional:'Facultatif', newSource:'Proposer une source', newSourceIntro:'Une source utile manque ? Soumettez son site public pour examen.',
    submitSource:'Soumettre la source', sourceSubmitted:'Votre proposition a été enregistrée pour examen.', sourceReview:'Nouvelles sources proposées',
  },
  es: {
    community:'La comunidad ID-EBP', account:'Tu cuenta', members:'Espacio de miembros', sourceWorkspace:'Tus fuentes', admin:'Administración',
    login:'Iniciar sesión', register:'Unirse a la comunidad', signOut:'Cerrar sesión', loading:'Comprobando el servicio de cuentas…',
    intro:'Ayuda a encontrar investigaciones, prácticas e ideas útiles. Añade etiquetas, valora fuentes y gestiona las que representas.',
    loginIntro:'Utiliza tu correo electrónico. Te enviaremos un código de un solo uso para entrar sin contraseña.',
    registerIntro:'Crea una cuenta para añadir etiquetas y valorar fuentes. Si representas una fuente, también puedes solicitar la gestión de su ficha.',
    setupTitle:'Es necesario activar las cuentas', setupBody:'Puedes revisar las pantallas. El acceso por correo y las contribuciones compartidas estarán disponibles cuando se conecte el servicio seguro. No se envía ningún dato mientras está inactivo.',
    setupShort:'Las contribuciones compartidas estarán disponibles cuando se conecte el servicio de cuentas.', serviceUnavailable:'No se ha podido conectar con el servicio de cuentas. Inténtalo más tarde.',
    email:'Correo electrónico', name:'Tu nombre', nameHint:'El nombre de tu cuenta no es un contacto público de la fuente.', sendCode:'Enviar mi código', sending:'Enviando…',
    codeTitle:'Revisa tu correo', codeBody:'Introduce el código de un solo uso enviado a {email}.', code:'Código de verificación', verify:'Verificar correo y entrar',
    changeEmail:'Utilizar otro correo', resend:'Enviar otro código', privacy:'Tu correo de acceso es privado. Se utiliza para proteger tu cuenta y comprobar tu relación con una fuente.',
    already:'¿Ya eres miembro?', create:'Crear una cuenta', accountOverview:'Tu membresía', confirmed:'Correo confirmado', unconfirmed:'Correo sin confirmar',
    emailRequirement:'Confirma tu correo antes de contribuir o solicitar la gestión de una fuente.',
    memberBenefits:'Haz más útil el directorio', tagsBenefit:'Añadir etiquetas que se puedan buscar', ratingsBenefit:'Valorar fuentes de 0 a 5 estrellas', sourcesBenefit:'Gestionar una fuente que representas',
    browse:'Explorar las fuentes', addTags:'Abre una ficha para proponer una etiqueta o valorar una fuente.',
    sourceIntro:'Gestione su ficha tras confirmar un correo de contacto aprobado o completar una revisión de titularidad.',
    managed:'Fuentes que gestionas', noManaged:'Todavía no gestionas ninguna fuente.', findSource:'Encuentra tu fuente', selectSource:'Elegir una fuente del directorio',
    claim:'Solicitar la gestión', claimHint:'Utiliza el correo de contacto aprobado de la fuente. La administración revisa las demás direcciones institucionales.',
    claimRequested:'Se ha recibido tu solicitud. El acceso se confirma con el correo de contacto aprobado de la fuente; la administración revisa las demás solicitudes.',
    signInRequired:'Inicia sesión para contribuir', signInClaim:'Entra con el correo de tu fuente para solicitar su gestión.',
    claimSource:'Solicitar acceso a esta fuente', claimSelected:'Fuente seleccionada', claims:'Tus solicitudes de gestión', pending:'Pendiente de revisión', approved:'Aprobado', rejected:'No aprobado',
    edit:'Editar la ficha', sourceName:'Nombre de la fuente', publisher:'Organización o autor', description:'Descripción de la fuente', descriptionHint:'Describe la fuente, sin traducir ni reproducir sus investigaciones. Máximo 600 caracteres.',
    topics:'Temas', methods:'Métodos de investigación', content:'Qué ofrece esta fuente', choose:'Selecciona lo que corresponda', submitRevision:'Enviar cambios a revisión',
    revisionHelp:'Los cambios se revisan antes de publicarse. El acceso a una fuente no evita las comprobaciones de todas las fichas.',
    revisionSubmitted:'Tus cambios se han guardado para su revisión.', website:'Sitio web', country:'País', languages:'Idiomas de la fuente',
    communityTitle:'Ayuda a encontrar esta fuente', communityIntro:'Los miembros pueden añadir etiquetas y valorar esta fuente. Las etiquetas se comprueban antes de publicarse.',
    aggregateEmpty:'Sin valoraciones', aggregate:'{average} de 5 · {count} valoraciones', yourRating:'Tu valoración', ratingHint:'Elige de 0 a 5 estrellas. Cero es una valoración; no valorar es diferente.',
    zeroStars:'0 estrellas', stars:'{count} estrellas', saveRating:'Guardar valoración', removeRating:'Retirar mi valoración', ratingSaved:'Se ha guardado tu valoración.', ratingRemoved:'Se ha retirado tu valoración.',
    ratingMissing:'Elige una valoración de 0 a 5.', tagLabel:'Proponer una etiqueta', tagPlaceholder:'Por ejemplo, policía de proximidad', tagHint:'Utiliza un tema, método o asunto breve, sin información personal.',
    submitTag:'Enviar etiqueta', tagSubmitted:'Tu etiqueta se podrá buscar cuando sea aprobada.', tags:'Etiquetas de la comunidad', noTags:'Todavía no hay etiquetas aprobadas.',
    verifiedDomain:'Contacto aprobado de la fuente confirmado', verifiedOrganisation:'Organización confirmada', notVerified:'Gestión de la fuente sin verificar',
    ratingRank:'Las valoraciones y la verificación contribuyen al orden de las fuentes. No determinan la calidad de las investigaciones individuales.',
    contributions:'Tus contribuciones', noContributions:'Tus etiquetas enviadas aparecerán aquí.', status:'Estado', openProfile:'Ver ficha pública',
    adminIntro:'Revisa solicitudes de gestión, cambios de fichas y etiquetas. Las decisiones se registran y publican mediante el servicio de cuentas.',
    adminOnly:'Se necesita acceso de administración.', adminLogin:'Entra con una cuenta de administración para abrir la cola de revisión.',
    reviewQueue:'Cola de revisión', noReviews:'No hay elementos pendientes.', tagReview:'Etiquetas', claimReview:'Solicitudes de gestión', revisionReview:'Cambios de fichas',
    approve:'Aprobar', reject:'Rechazar', reason:'Nota de revisión', reasonHint:'Explica la decisión. Esta nota quedará registrada.', decisionSaved:'Se ha registrado la decisión.',
    source:'Fuente', submittedBy:'Enviado por', proposed:'Detalles propuestos', viewSource:'Ver fuente', refresh:'Actualizar',
    requestError:'No se ha podido completar la solicitud. Inténtalo de nuevo.', rateLimited:'Demasiadas solicitudes. Espera antes de intentarlo de nuevo.',
    invalidCode:'El código no es válido o ha caducado. Solicita otro código.', invalidEmail:'Introduce un correo válido.',
    unauthorised:'Tu sesión ha terminado. Vuelve a entrar.', forbidden:'Tu cuenta no tiene permiso para esta acción.',
    csrf:'Actualiza la página e inténtalo de nuevo.', badRequest:'Comprueba los datos introducidos.', domainMismatch:'Tu dominio no permite verificar la gestión. Tu solicitud necesita revisión.',
    sourceUnavailable:'No se ha encontrado esta fuente.', saved:'Guardado', back:'Volver a tus fuentes', ownRating:'Tu valoración actual: {count} de 5',
    claimState:'{source} · {state}', editorAdded:'Fuente del directorio', activation:'Activación', memberNavigation:'Navegación de miembros',
    publicTags:'Las etiquetas aprobadas son públicas y se pueden buscar. Nunca se incluye tu correo.', editUnavailable:'Los detalles de esta fuente no están disponibles en esta versión del directorio.',
    available:'Disponible', closed:'Sin conectar', optional:'Opcional', newSource:'Proponer una fuente', newSourceIntro:'¿Falta una fuente útil? Envía su sitio público para su revisión.',
    submitSource:'Enviar fuente a revisión', sourceSubmitted:'Tu propuesta se ha guardado para su revisión.', sourceReview:'Nuevas fuentes propuestas',
  },
};

Object.assign(COPY.en,{type:'Source type',emailSetupTitle:'Email sign-in is being connected',emailSetupBody:'New sign-ins and registrations are not yet available. Existing signed-in members can continue to use their accounts.',duplicateContribution:'You have already submitted this contribution.',claimEmail:'Source representative email',claimEvidence:'Ownership evidence',managedAccess:'Source management access confirmed',mfaTitle:'Confirm administrator access',mfaIntro:'Administrator decisions require a second factor. Use an authenticator app to confirm access to the review queue.',mfaSetup:'Set up an authenticator',mfaScan:'Scan this code with your authenticator app, or enter the setup key.',mfaSecret:'Authenticator setup key',mfaCode:'Six-digit authenticator code',mfaVerify:'Confirm and open the review queue',mfaRequired:'Enter the current code from your authenticator app.',mfaError:'That authenticator code could not be verified. Try the current code.'});
Object.assign(COPY.fr,{type:'Type de source',emailSetupTitle:'Connexion par courriel en préparation',emailSetupBody:'Les nouvelles connexions et inscriptions ne sont pas encore disponibles. Les membres déjà connectés peuvent continuer à utiliser leur compte.',duplicateContribution:'Vous avez déjà soumis cette contribution.',claimEmail:'Courriel du représentant',claimEvidence:'Justificatifs de gestion',managedAccess:'Accès à la gestion confirmé',mfaTitle:'Confirmer l’accès administrateur',mfaIntro:'Les décisions nécessitent un second facteur. Utilisez une application d’authentification pour accéder à la file d’examen.',mfaSetup:'Configurer l’authentification',mfaScan:'Scannez ce code avec votre application, ou saisissez la clé de configuration.',mfaSecret:'Clé de configuration',mfaCode:'Code d’authentification à six chiffres',mfaVerify:'Confirmer et ouvrir la file',mfaRequired:'Saisissez le code actuel de votre application.',mfaError:'Ce code n’a pas pu être vérifié. Essayez le code actuel.'});
Object.assign(COPY.es,{type:'Tipo de fuente',emailSetupTitle:'Se está conectando el acceso por correo',emailSetupBody:'Todavía no están disponibles los nuevos accesos y registros. Los miembros con sesión abierta pueden seguir utilizando sus cuentas.',duplicateContribution:'Ya has enviado esta contribución.',claimEmail:'Correo del representante',claimEvidence:'Pruebas de gestión',managedAccess:'Acceso de gestión confirmado',mfaTitle:'Confirmar acceso de administración',mfaIntro:'Las decisiones requieren un segundo factor. Utiliza una aplicación de autenticación para acceder a la cola de revisión.',mfaSetup:'Configurar la autenticación',mfaScan:'Escanea este código con tu aplicación o introduce la clave de configuración.',mfaSecret:'Clave de configuración',mfaCode:'Código de autenticación de seis dígitos',mfaVerify:'Confirmar y abrir la cola',mfaRequired:'Introduce el código actual de tu aplicación.',mfaError:'No se ha podido verificar el código. Prueba con el código actual.'});
const LANGUAGE_CODES={English:'en',French:'fr',Spanish:'es',Arabic:'ar',Portuguese:'pt',German:'de',Dutch:'nl',Italian:'it',Polish:'pl',Welsh:'cy',Irish:'ga',Swedish:'sv',Norwegian:'no',Danish:'da',Finnish:'fi',Romanian:'ro',Greek:'el',Hungarian:'hu',Czech:'cs',Ukrainian:'uk',Turkish:'tr',Russian:'ru',Hindi:'hi',Urdu:'ur',Bengali:'bn','Mandarin Chinese':'zh',Japanese:'ja',Korean:'ko',Indonesian:'id',Malay:'ms',Thai:'th',Vietnamese:'vi',Swahili:'sw',Zulu:'zu',Afrikaans:'af','Māori':'mi'};
const state = {status:null, session:{user:null}, unavailable:false, init:null, claimTarget:'', pendingEmail:'', createAccount:false, displayName:'', reviews:null, mfaRequired:false, mfa:null, enrolledFactor:null, profiles:new Map(), communities:new Map(), publicCommunity:{}};
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tr = (lang,key,values={}) => (COPY[lang]?.[key] ?? COPY.en[key] ?? key).replace(/\{(\w+)\}/g, (_,name) => String(values[name] ?? ''));
const i = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${({member:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',source:'<path d="M4 3h12l4 4v14H4zM15 3v5h5M8 12h8M8 16h6"/>',shield:'<path d="m12 3 8 4v5c0 5-8 9-8 9s-8-4-8-9V7zM8 12l3 3 5-6"/>',tag:'<path d="M3 3h8l10 10-8 8L3 11z"/><circle cx="7.5" cy="7.5" r="1"/>',star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',check:'<path d="m5 12 4 4L19 6"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>'})[name] || ''}</svg>`;

export function normaliseRating(value) {
  if (value === null || value === undefined || value === '') return null;
  if(typeof value !== 'number' && (typeof value !== 'string' || !/^[0-5]$/.test(value.trim()))) return null;
  const number = typeof value === 'number' ? value : Number(value.trim());
  return Number.isInteger(number) && number >= 0 && number <= 5 ? number : null;
}

export function memberCopy(lang='en') { return {...(COPY[lang] || COPY.en)}; }
export function getMemberSession() { return state.session; }
export function publicDirectoryIsAuthoritative(){return state.directoryAuthoritative===true;}
export function getContributionSummary(sourceId) {
  const info=state.communities.get(sourceId);
  return info ? {ratingAverage:info.rating?.average ?? null,ratingCount:info.rating?.count || 0,tags:(info.tags || []).map(tag=>tag.label),domainConfirmed:Boolean(info.verification?.domainConfirmed),organisationConfirmed:Boolean(info.verification?.organisationConfirmed)} : (state.publicCommunity[sourceId] || {ratingAverage:null,ratingCount:0,tags:[],domainConfirmed:false,organisationConfirmed:false});
}
export function isMemberPath(path) { return ['/login','/register','/account','/members','/source-workspace','/source-preview','/admin','/admin-preview'].includes(path); }

async function api(path,{method='GET',body}={}) {
  const headers = {'Accept':'application/json'};
  if (body !== undefined) headers['Content-Type']='application/json';
  if (method !== 'GET' && state.session.csrfToken) headers['X-CSRF-Token']=state.session.csrfToken;
  const response = await fetch(`/api${path}`,{method,headers,credentials:'same-origin',cache:'no-store',...(body !== undefined?{body:JSON.stringify(body)}:{})});
  const type=response.headers.get('Content-Type') || '';
  const data=type.includes('application/json') ? await response.json() : {};
  if (!response.ok) { const error=new Error(data.error?.code || (response.status===404?'unavailable':'request_failed')); error.code=data.error?.code; error.status=response.status; throw error; }
  return data;
}

export async function initialiseMembers({refresh=false}={}) {
  if (state.init && !refresh) return state.init;
  state.init=(async()=>{
    try {
      state.status=await api('/status'); state.unavailable=false;
      state.session={user:null};
      if(state.status.configured) {
        try {state.session=await api('/session');}
        catch(error) {if(![401,403].includes(error.status)) state.unavailable=true;}
      }
    } catch { state.unavailable=true; state.status={configured:false,mode:'setup_required'}; state.session={user:null}; }
    return {status:state.status,session:state.session};
  })();
  return state.init;
}

export async function loadPublicContributions() {
  try { const result=await api('/community'); state.directoryAuthoritative=result.authoritative===true; state.publicCommunity=result.sources || {}; return state.publicCommunity; }
  catch { return null; }
}

function banner(lang) {
  if (!state.status) return `<div class="member-service member-service-loading" role="status">${i('info')}<p>${esc(tr(lang,'loading'))}</p></div>`;
  if(state.status.configured && state.unavailable) return `<div class="member-service" role="status">${i('info')}<p>${esc(tr(lang,'serviceUnavailable'))}</p></div>`;
  if (state.status.configured) return state.status.email===false ? `<div class="member-service" role="note">${i('mail')}<div><strong>${esc(tr(lang,'emailSetupTitle'))}</strong><p>${esc(tr(lang,'emailSetupBody'))}</p></div></div>` : '';
  return `<div class="member-service" role="note">${i('info')}<div><strong>${esc(tr(lang,state.unavailable?'serviceUnavailable':'setupTitle'))}</strong><p>${esc(tr(lang,'setupBody'))}</p></div></div>`;
}
const canWrite = () => Boolean(state.status?.configured && state.session.user?.emailConfirmed);
const disabled = () => state.status?.configured && state.status.email!==false ? '' : ' disabled';
const safeId = value => encodeURIComponent(String(value || ''));
const field = (label,name,value='',extra='') => `<label class="member-field"><span>${esc(label)}</span><input name="${name}" value="${esc(value)}" ${extra}></label>`;
const messageRegion = () => '<p class="member-message" data-member-message role="status" aria-live="polite"></p>';

function nav(lang,path) {
  return `<nav class="member-nav" aria-label="${esc(tr(lang,'memberNavigation'))}">${[['/account','member','members'],['/source-workspace','source','sourceWorkspace'],['/admin','shield','admin']].map(([href,icon,key])=>`<a href="#${href}" ${path===href||path==='/members'&&href==='/account'?'aria-current="page"':''}>${i(icon)}${esc(tr(lang,key))}</a>`).join('')}</nav>`;
}

function benefits(lang) {
  return `<div class="member-benefits"><h2>${esc(tr(lang,'memberBenefits'))}</h2>${[['tag','tagsBenefit'],['star','ratingsBenefit'],['source','sourcesBenefit']].map(([icon,key])=>`<p><span>${i(icon)}</span>${esc(tr(lang,key))}</p>`).join('')}</div>`;
}

function authView({path,lang}) {
  const register=path==='/register';
  if(state.session.user) return `<div class="member-panel"><h2>${esc(tr(lang,'accountOverview'))}</h2><p>${esc(state.session.user.displayName || state.session.user.email)}</p><a class="button" href="#/account">${esc(tr(lang,'members'))}${i('arrow')}</a></div>`;
  const codeStep=Boolean(state.pendingEmail);
  return `<div class="member-auth-grid"><div><h2>${esc(tr(lang,codeStep?'codeTitle':register?'register':'login'))}</h2><p>${esc(tr(lang,codeStep?'codeBody':register?'registerIntro':'loginIntro',{email:state.pendingEmail}))}</p>${benefits(lang)}</div><div class="member-panel">${messageRegion()}${codeStep?`<form data-member-form="verify">${field(tr(lang,'code'),'token','','type="text" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6,10}" maxlength="10" required')}<button class="button member-full" type="submit"${disabled()}>${esc(tr(lang,'verify'))}</button></form><div class="member-auth-links"><button type="button" class="text-button" data-member-action="change-email">${esc(tr(lang,'changeEmail'))}</button><button type="button" class="text-button" data-member-action="resend"${disabled()}>${esc(tr(lang,'resend'))}</button></div>`:`<form data-member-form="request" data-create-account="${register}">${register?field(tr(lang,'name'),'displayName','','type="text" autocomplete="name" maxlength="100" required')+`<p class="member-hint">${esc(tr(lang,'nameHint'))}</p>`:''}${field(tr(lang,'email'),'email','','type="email" autocomplete="email" maxlength="254" required')}<button class="button member-full" type="submit"${disabled()}>${i('mail')}${esc(tr(lang,'sendCode'))}</button></form><p class="member-hint">${esc(tr(lang,'privacy'))}</p><p class="member-auth-links">${esc(tr(lang,register?'already':'create'))} <a href="#/${register?'login':'register'}">${esc(tr(lang,register?'login':'register'))}</a></p>`}</div></div>`;
}

function accountView({lang}) {
  const user=state.session.user;
  return `${messageRegion()}<div class="member-dashboard"><div class="member-panel member-account-card"><span class="member-avatar">${i('member')}</span><h2>${esc(user?.displayName || tr(lang,'accountOverview'))}</h2>${user?`<p>${esc(user.email)}</p><span class="member-badge ${user.emailConfirmed?'is-verified':''}">${i(user.emailConfirmed?'check':'info')}${esc(tr(lang,user.emailConfirmed?'confirmed':'unconfirmed'))}</span>${!user.emailConfirmed?`<p>${esc(tr(lang,'emailRequirement'))}</p>`:''}<button class="button button-outline" data-member-action="logout">${esc(tr(lang,'signOut'))}</button>`:`<p>${esc(tr(lang,'intro'))}</p><a class="button" href="#/login">${esc(tr(lang,'login'))}</a>`}</div><div class="member-panel"><h2>${esc(tr(lang,'communityTitle'))}</h2><p>${esc(tr(lang,'addTags'))}</p>${benefits(lang)}<a class="button" href="#/directory">${esc(tr(lang,'browse'))}${i('arrow')}</a></div><div class="member-panel member-span"><h2>${esc(tr(lang,'contributions'))}</h2>${state.session.tagSuggestions?.length?`<ul class="member-list">${state.session.tagSuggestions.map(tag=>`<li><strong>${esc(tag.label)}</strong><span class="member-badge">${esc(reviewState(lang,tag.state || tag.status))}</span></li>`).join('')}</ul>`:`<p>${esc(tr(lang,'noContributions'))}</p>`}</div></div>`;
}

function sourceFor(sources,slug) { return sources.find(source => source.id===slug || source.slug===slug); }
function sourceSlug(source) { return source.slug || source.id; }
function reviewState(lang,value) { return tr(lang,({pending:'pending',review:'pending',approved:'approved',accepted:'approved',rejected:'rejected',denied:'rejected'})[value] || 'pending'); }
function optionLabel(value,lang) {
  if(COUNTRY_CODES[value]) return new Intl.DisplayNames([lang],{type:'region'}).of(COUNTRY_CODES[value]);
  if(LANGUAGE_CODES[value]) return new Intl.DisplayNames([lang],{type:'language'}).of(LANGUAGE_CODES[value]);
  return LABELS[lang]?.[value] || value;
}
function selectOptions(values,selected=[],lang='en') { return values.map(value=>`<option value="${esc(value)}" ${selected.includes(value)?'selected':''}>${esc(optionLabel(value,lang))}</option>`).join(''); }

function sourceEditor(source,lang) {
  if(!source) return `<p>${esc(tr(lang,'editUnavailable'))}</p>`;
  return `<form data-member-form="revision" data-source="${esc(sourceSlug(source))}">${field(tr(lang,'sourceName'),'name',source.name,'required maxlength="160"')}${field(tr(lang,'publisher'),'publisher',source.publisher || source.owner || '','maxlength="160"')}<label class="member-field"><span>${esc(tr(lang,'description'))}</span><textarea name="about" rows="5" required minlength="20" maxlength="600">${esc(source.about)}</textarea><small>${esc(tr(lang,'descriptionHint'))}</small></label><div class="member-form-grid">${[['topics',TOPICS,source.topics],['methods',METHODS,source.methods],['contentTypes',CONTENT,source.contentTypes || source.content]].map(([name,values,selected])=>`<label class="member-field"><span>${esc(tr(lang,name==='contentTypes'?'content':name))}</span><select name="${name}" multiple size="5" ${name==='contentTypes'?'required':''}>${selectOptions(values,selected || [],lang)}</select><small>${esc(tr(lang,'choose'))}</small></label>`).join('')}</div><p class="member-hint">${esc(tr(lang,'revisionHelp'))}</p><button class="button" type="submit" ${canWrite()?'':'disabled'}>${esc(tr(lang,'submitRevision'))}</button></form>`;
}

function claimForm({lang,sources,params}) {
  const selected=params?.get('claim') || '';
  return `<form data-member-form="claim"><label class="member-field"><span>${esc(tr(lang,'selectSource'))}</span><select name="source" required><option value="">${esc(tr(lang,'selectSource'))}</option>${sources.filter(s=>s.status!=='hidden').slice().sort((a,b)=>a.name.localeCompare(b.name)).map(source=>`<option value="${esc(sourceSlug(source))}" ${sourceSlug(source)===selected?'selected':''}>${esc(source.name)}</option>`).join('')}</select></label><p class="member-hint">${esc(tr(lang,'claimHint'))}</p>${state.session.user?`<button class="button" type="submit" ${canWrite()?'':'disabled'}>${esc(tr(lang,'claim'))}</button>`:`<p>${esc(tr(lang,'signInClaim'))}</p><a class="button" href="#/login">${esc(tr(lang,'login'))}</a>`}</form>`;
}

function sourceSuggestion(lang) {
  return `<details class="member-panel member-suggestion"><summary>${esc(tr(lang,'newSource'))}</summary><p>${esc(tr(lang,'newSourceIntro'))}</p><form data-member-form="new-source">${field(tr(lang,'sourceName'),'name','','required maxlength="160"')}${field(tr(lang,'website'),'url','','type="url" placeholder="https://" pattern="https://.+" required maxlength="2048"')}<label class="member-field"><span>${esc(tr(lang,'description'))}</span><textarea name="about" rows="4" minlength="20" maxlength="600" required></textarea></label><div class="member-form-grid"><label class="member-field"><span>${esc(tr(lang,'country'))}</span><select name="country" required><option value="">—</option>${selectOptions(BASE_COUNTRIES,[],lang)}</select></label><label class="member-field"><span>${esc(tr(lang,'languages'))}</span><select name="languages" multiple size="4" required>${selectOptions(LANGUAGES,[],lang)}</select></label><label class="member-field"><span>${esc(tr(lang,'type'))}</span><select name="types" multiple size="4" required>${selectOptions(TYPES,[],lang)}</select></label></div><button class="button" type="submit" ${canWrite()?'':'disabled'}>${esc(tr(lang,'submitSource'))}</button></form></details>`;
}

function sourceWorkspaceView(context) {
  const {lang,sources,params}=context;
  const managed=state.session.managedSources || [];
  const selected=params?.get('edit');
  const owned=managed.find(s=>s.slug===selected || s.id===selected);
  return `${messageRegion()}<div class="member-source-layout"><div><section class="member-panel"><h2>${esc(tr(lang,'managed'))}</h2>${managed.length?`<div class="member-source-cards">${managed.map(item=>`<article><span class="member-icon">${i('source')}</span><div><h3>${esc(item.name || sourceFor(sources,item.slug)?.name || item.slug)}</h3><p class="member-badge is-verified">${i('shield')}${esc(tr(lang,'managedAccess'))}</p></div><div class="member-source-links"><a href="#/source/${safeId(item.slug || item.id)}">${esc(tr(lang,'openProfile'))}</a><a class="button button-outline button-small" href="#/source-workspace?edit=${safeId(item.slug || item.id)}">${esc(tr(lang,'edit'))}</a></div></article>`).join('')}</div>`:`<p>${esc(tr(lang,'noManaged'))}</p>`}</section>${selected?`<section class="member-panel"><h2>${esc(tr(lang,'edit'))}</h2>${owned?sourceEditor(state.profiles.get(owned.slug || owned.id) || sourceFor(sources,owned.slug || owned.id),lang):`<p>${esc(tr(lang,'forbidden'))}</p>`}</section>`:''}${state.status?.features?.sourceSuggestions || !state.status?.configured?sourceSuggestion(lang):''}</div><aside><section class="member-panel"><h2>${esc(tr(lang,'findSource'))}</h2><p>${esc(tr(lang,'sourceIntro'))}</p>${claimForm(context)}</section>${state.session.claims?.length?`<section class="member-panel"><h2>${esc(tr(lang,'claims'))}</h2><ul class="member-list">${state.session.claims.map(claim=>`<li><strong>${esc(claim.sourceName || claim.name || sourceFor(sources,claim.sourceSlug || claim.slug)?.name || claim.sourceSlug || claim.slug || tr(lang,'source'))}</strong><span class="member-badge">${esc(reviewState(lang,claim.state || claim.status))}</span></li>`).join('')}</ul></section>`:''}</aside></div>`;
}

function reviewCard(item,kind,lang,sources) {
  const slug=item.sourceSlug || item.slug || item.source_id;
  const name=item.sourceName || item.profile?.name || sourceFor(sources,slug)?.name || slug || tr(lang,'source');
  const proposed=item.patch || item.proposed || item.changes || item.profile || (kind==='submission'?item:{});
  return `<article class="member-review"><div><span class="member-badge">${esc(tr(lang,kind==='tag'?'tagReview':kind==='claim'?'claimReview':kind==='submission'?'sourceReview':'revisionReview'))}</span><h3>${esc(kind==='tag'?item.label:name)}</h3>${slug?`<a href="#/source/${safeId(slug)}">${esc(name)}</a>`:''}${item.requestedByName || item.submittedBy?`<p class="member-hint">${esc(tr(lang,'submittedBy'))}: ${esc(item.requestedByName || item.submittedBy)}</p>`:''}</div>${kind==='claim'?`<dl><dt>${esc(tr(lang,'claimEmail'))}</dt><dd>${esc(item.email || '')}</dd>${item.evidence?`<dt>${esc(tr(lang,'claimEvidence'))}</dt><dd><code>${esc(JSON.stringify(item.evidence))}</code></dd>`:''}</dl>`:''}${kind==='revision'||kind==='submission'?`<details><summary>${esc(tr(lang,'proposed'))}</summary><dl>${Object.entries(proposed).map(([key,value])=>`<dt>${esc(tr(lang,key==='about'?'description':key==='contentTypes'?'content':key))}</dt><dd>${esc(Array.isArray(value)?value.join(', '):typeof value==='object'?JSON.stringify(value):value)}</dd>`).join('')}</dl></details>`:''}<form data-member-form="review" data-kind="${kind}" data-review-id="${esc(item.id)}"><label class="member-field"><span>${esc(tr(lang,'reason'))}</span><textarea name="reason" rows="2" maxlength="1000" required></textarea><small>${esc(tr(lang,'reasonHint'))}</small></label><div class="member-actions"><button class="button button-small" type="submit" name="decision" value="approve">${i('check')}${esc(tr(lang,'approve'))}</button><button class="button button-outline button-small member-reject" type="submit" name="decision" value="reject">${esc(tr(lang,'reject'))}</button></div></form></article>`;
}

function mfaView(lang) {
  const factor=state.enrolledFactor || state.mfa?.factors?.find(item=>item.status==='verified') || state.mfa?.factors?.[0];
  const rawQr=factor?.totp?.qr_code;
  const qr=typeof rawQr==='string' && rawQr.trim().startsWith('<svg') ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(rawQr)}` : typeof rawQr==='string' && rawQr.startsWith('data:image/svg+xml') ? rawQr : null;
  return `<section class="member-panel member-mfa"><span class="member-avatar">${i('shield')}</span><h2>${esc(tr(lang,'mfaTitle'))}</h2><p>${esc(tr(lang,'mfaIntro'))}</p>${messageRegion()}${factor?`${qr?`<img class="member-mfa-qr" src="${esc(qr)}" alt="${esc(tr(lang,'mfaScan'))}" width="200" height="200">`:''}${factor.totp?.secret?`<p>${esc(tr(lang,'mfaScan'))}</p><label class="member-field"><span>${esc(tr(lang,'mfaSecret'))}</span><input readonly value="${esc(factor.totp.secret)}" autocomplete="off" spellcheck="false"></label>`:`<p>${esc(tr(lang,'mfaRequired'))}</p>`}<form data-member-form="mfa" data-factor-id="${esc(factor.id)}">${field(tr(lang,'mfaCode'),'code','','type="text" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required')}<button class="button" type="submit">${esc(tr(lang,'mfaVerify'))}</button></form>`:`<button type="button" class="button" data-member-action="enrol-mfa">${esc(tr(lang,'mfaSetup'))}</button>`}</section>`;
}

function adminView({lang,sources}) {
  if (!state.session.user?.admin) return `<div class="member-panel member-lock">${i('shield')}<h2>${esc(tr(lang,'adminOnly'))}</h2><p>${esc(tr(lang,'adminLogin'))}</p>${!state.session.user?`<a class="button" href="#/login">${esc(tr(lang,'login'))}</a>`:''}</div>`;
  if (state.mfaRequired || state.session.mfaRequired) return mfaView(lang);
  const reviews=state.reviews;
  const list=reviews?[...(reviews.tags || []).map(item=>[item,'tag']),...(reviews.claims || []).map(item=>[item,'claim']),...(reviews.revisions || []).map(item=>[item,'revision']),...(reviews.submissions || []).map(item=>[item,'submission'])]:[];
  return `${messageRegion()}<section class="member-panel"><div class="member-section-head"><h2>${esc(tr(lang,'reviewQueue'))}</h2><button class="button button-outline button-small" data-member-action="refresh-admin">${esc(tr(lang,'refresh'))}</button></div>${!reviews?`<p>${esc(tr(lang,'loading'))}</p>`:list.length?`<div class="member-review-list">${list.map(([item,kind])=>reviewCard(item,kind,lang,sources)).join('')}</div>`:`<p>${esc(tr(lang,'noReviews'))}</p>`}</section>`;
}

function pageContent(context) {
  const {path,lang}=context;
  const auth=path==='/login'||path==='/register';
  const sources=path==='/source-workspace'||path==='/source-preview';
  const admin=path==='/admin'||path==='/admin-preview';
  const title=auth?(path==='/register'?'register':'login'):sources?'sourceWorkspace':admin?'admin':'members';
  return `<section class="container member-page-head"><p class="eyebrow">${esc(tr(lang,'community'))}</p><h1>${esc(tr(lang,title))}</h1>${!auth?`<p>${esc(tr(lang,admin?'adminIntro':sources?'sourceIntro':'intro'))}</p>`:''}</section><div class="container member-layout">${!auth?nav(lang,sources?'/source-workspace':admin?'/admin':'/account'):''}${banner(lang)}${auth?authView(context):sources?sourceWorkspaceView(context):admin?adminView(context):accountView(context)}</div>`;
}

export function renderMemberPage({path='/account',params=new URLSearchParams(),lang='en',sources=[]}={}) {
  return `<div class="members-app" data-member-page data-member-path="${esc(path)}" data-member-query="${esc(params.toString())}">${pageContent({path,params,lang,sources})}</div>`;
}

function errorText(lang,error) {
  const code=error.code || '';
  const key=({setup_required:'setupShort',rate_limited:'rateLimited',invalid_email:'invalidEmail',invalid_code:'invalidCode',otp_expired:'invalidCode',otp_invalid:'invalidCode',unauthenticated:'unauthorised',authentication_required:'unauthorised',forbidden:'forbidden',csrf_failed:'csrf',csrf_invalid:'csrf',invalid_csrf:'csrf',bad_request:'badRequest',validation_error:'badRequest',invalid_rating:'ratingMissing',source_not_found:'sourceUnavailable',not_found:'sourceUnavailable',sign_in_required:'unauthorised',confirmed_email_required:'emailRequirement',invalid_details:'badRequest',auth_email_unavailable:'emailSetupBody',request_code_first:'invalidCode',already_submitted:'duplicateContribution',domain_mismatch:'domainMismatch',mfa_required:'mfaRequired',invalid_mfa_code:'mfaError',email_not_confirmed:'emailRequirement'})[code] || (error.status===401?'unauthorised':error.status===403?'forbidden':error.status===429?'rateLimited':error.status===400?'badRequest':'requestError');
  return tr(lang,key);
}

function showMessage(host,text,error=false) {
  const region=host.querySelector('[data-member-message]');
  if(!region) return;
  region.textContent=text; region.classList.toggle('is-error',error);
  region.setAttribute('role',error?'alert':'status');
}

async function refreshSession() { state.session=await api('/session'); return state.session; }

export function bindMemberPage({root=globalThis.document,lang='en',sources=[],onChange=()=>{}}={}) {
  const host=root.querySelector('[data-member-page]'); if(!host || host.dataset.memberBound) return;
  host.dataset.memberBound='true';
  const context={path:host.dataset.memberPath,params:new URLSearchParams(host.dataset.memberQuery || ''),lang,sources};
  if(context.params.get('claim')) state.claimTarget=context.params.get('claim');
  const refresh=()=>{if(host.isConnected) host.innerHTML=pageContent(context);};
  const loadReviews=async()=>{
    if(state.session.user?.admin && ['/admin','/admin-preview'].includes(context.path)) {
      try{state.reviews=await api('/admin/review');state.mfaRequired=false;}
      catch(error){if(error.code!=='mfa_required')throw error;state.mfaRequired=true;state.mfa=await api('/auth/mfa');}
    }
  };
  initialiseMembers().then(async()=>{
    try{
      await loadReviews();
      const selected=context.params.get('edit');
      if(selected && state.session.managedSources?.some(item=>item.slug===selected || item.id===selected)) {
        const {profile}=await api(`/sources/${safeId(selected)}/profile`);
        if(profile) state.profiles.set(selected,{...sourceFor(sources,selected),...profile,id:selected});
      }
    }catch(error){refresh();showMessage(host,errorText(lang,error),true);return;}refresh();
  });
  host.addEventListener('click',async event=>{
    const button=event.target.closest('[data-member-action]'); if(!button) return;
    try {
      if(button.dataset.memberAction==='change-email') {state.pendingEmail='';refresh();}
      if(button.dataset.memberAction==='logout') {await api('/auth/logout',{method:'POST',body:{}});state.session={user:null};state.communities.clear();state.enrolledFactor=null;state.mfa=null;state.mfaRequired=false;state.profiles.clear();state.reviews=null;refresh();onChange();}
      if(button.dataset.memberAction==='resend') {await api('/auth/request',{method:'POST',body:{email:state.pendingEmail,createAccount:state.createAccount,...(state.displayName?{displayName:state.displayName}:{})}});showMessage(host,tr(lang,'codeBody',{email:state.pendingEmail}));}
      if(button.dataset.memberAction==='refresh-admin') {state.reviews=await api('/admin/review');refresh();}
      if(button.dataset.memberAction==='enrol-mfa') {const result=await api('/auth/mfa/enrol',{method:'POST',body:{}});state.enrolledFactor=result.factor;refresh();}
    } catch(error) {showMessage(host,errorText(lang,error),true);}
  });
  host.addEventListener('submit',async event=>{
    const form=event.target.closest('[data-member-form]'); if(!form) return; event.preventDefault();
    if(!state.status?.configured) {showMessage(host,tr(lang,'setupShort'),true);return;}
    const data=new FormData(form), kind=form.dataset.memberForm, submitter=event.submitter;
    const buttons=[...form.querySelectorAll('button')];buttons.forEach(button=>button.disabled=true);
    try {
      if(kind==='request') {
        const email=String(data.get('email') || '').trim(); const displayName=String(data.get('displayName') || '').trim(); const createAccount=form.dataset.createAccount==='true';
        await api('/auth/request',{method:'POST',body:{email,createAccount,...(displayName?{displayName}:{})}});
        state.pendingEmail=email;state.createAccount=createAccount;state.displayName=displayName;refresh();host.querySelector('[name="token"]')?.focus();
      } else if(kind==='verify') {
        await api('/auth/verify',{method:'POST',body:{email:state.pendingEmail,token:String(data.get('token') || '').trim()}});await refreshSession();state.pendingEmail='';onChange();const destination=state.claimTarget?`/source-workspace?claim=${safeId(state.claimTarget)}`:'/account';state.claimTarget='';globalThis.location.hash=destination;
      } else if(kind==='claim') {
        await api(`/sources/${safeId(data.get('source'))}/claim`,{method:'POST',body:{}});await refreshSession();refresh();showMessage(host,tr(lang,'claimRequested'));onChange();
      } else if(kind==='revision') {
        await api(`/sources/${safeId(form.dataset.source)}/profile`,{method:'PATCH',body:{name:String(data.get('name') || '').trim(),about:String(data.get('about') || '').trim(),publisher:String(data.get('publisher') || '').trim(),topics:data.getAll('topics'),methods:data.getAll('methods'),contentTypes:data.getAll('contentTypes')}});
        showMessage(host,tr(lang,'revisionSubmitted'));
      } else if(kind==='new-source') {
        await api('/sources',{method:'POST',body:{name:String(data.get('name') || '').trim(),url:String(data.get('url') || '').trim(),about:String(data.get('about') || '').trim(),country:COUNTRY_CODES[data.get('country')],languages:data.getAll('languages').map(name=>LANGUAGE_CODES[name]).filter(Boolean),types:data.getAll('types')}});form.reset();showMessage(host,tr(lang,'sourceSubmitted'));
      } else if(kind==='review') {
        await api('/admin/review',{method:'POST',body:{kind:form.dataset.kind,id:form.dataset.reviewId,decision:submitter?.value,reason:String(data.get('reason') || '').trim()}});
        state.reviews=await api('/admin/review');refresh();showMessage(host,tr(lang,'decisionSaved'));onChange();
      } else if(kind==='mfa') {
        await api('/auth/mfa/verify',{method:'POST',body:{factorId:form.dataset.factorId,code:String(data.get('code') || '').trim()}});
        state.enrolledFactor=null;state.mfa=null;state.mfaRequired=false;await refreshSession();await loadReviews();refresh();onChange();
      }
    } catch(error) {showMessage(host,errorText(lang,error),true);} finally {buttons.forEach(button=>button.disabled=false);}
  });
}

function ratingSummary(rating,lang) {
  const count=Number(rating?.count) || 0;
  const average=Number(rating?.average);
  if(!count || rating?.average===null || !Number.isFinite(average)) return `<div class="member-rating-summary"><span class="member-rating-stars" aria-hidden="true">☆☆☆☆☆</span><strong>${esc(tr(lang,'aggregateEmpty'))}</strong></div>`;
  const rounded=Math.max(0,Math.min(5,average));
  return `<div class="member-rating-summary"><span class="member-rating-stars rating-fill-${Math.round(rounded*10)}" aria-hidden="true"><span>★★★★★</span><b>★★★★★</b></span><strong>${esc(tr(lang,'aggregate',{average:new Intl.NumberFormat(lang,{minimumFractionDigits:1,maximumFractionDigits:1}).format(rounded),count}))}</strong></div>`;
}

function contributionContent(source,lang) {
  const slug=sourceSlug(source), info=state.communities.get(slug), can=canWrite(), own=normaliseRating(info?.rating?.own);
  const tags=info?.tags || (state.publicCommunity[slug]?.tags || []).map(label=>({label}));
  const rating=info?.rating || {average:state.publicCommunity[slug]?.ratingAverage ?? null,count:state.publicCommunity[slug]?.ratingCount || 0};
  const verified=info?.verification || state.publicCommunity[slug] || {};
  return `<div class="member-contribution-head"><span class="member-icon">${i('tag')}</span><div><h2>${esc(tr(lang,'communityTitle'))}</h2><p>${esc(tr(lang,'communityIntro'))}</p></div></div>${messageRegion()}${ratingSummary(rating,lang)}<p class="member-verification ${verified.domainConfirmed||verified.organisationConfirmed?'is-verified':''}">${i('shield')}${esc(tr(lang,verified.organisationConfirmed?'verifiedOrganisation':verified.domainConfirmed?'verifiedDomain':'notVerified'))}</p>${!state.status?.configured?`<p class="member-hint">${esc(tr(lang,state.status?'setupShort':'loading'))}</p>`:!state.session.user?`<p><a href="#/login">${esc(tr(lang,'signInRequired'))}</a></p>`:!state.session.user.emailConfirmed?`<p>${esc(tr(lang,'emailRequirement'))}</p>`:''}<form data-contribution-form="rating"><fieldset class="member-rating-fieldset"><legend>${esc(tr(lang,'yourRating'))}</legend><div class="member-rating-options">${[0,1,2,3,4,5].map(stars=>`<label class="member-rating-choice"><input type="radio" name="rating" value="${stars}" ${own===stars?'checked':''} ${can?'':'disabled'}><span aria-hidden="true">${stars}${stars?' ★':''}</span><span class="sr-only">${esc(tr(lang,stars?'stars':'zeroStars',{count:stars}))}</span></label>`).join('')}</div><p class="member-hint">${esc(tr(lang,'ratingHint'))}</p></fieldset><div class="member-actions"><button class="button button-small" type="submit" ${can?'':'disabled'}>${esc(tr(lang,'saveRating'))}</button>${own!==null?`<button type="button" class="text-button" data-contribution-action="remove-rating" ${can?'':'disabled'}>${esc(tr(lang,'removeRating'))}</button>`:''}</div></form><div class="member-community-tags"><h3>${esc(tr(lang,'tags'))}</h3>${tags.length?`<div class="tags">${tags.map(tag=>`<a class="tag" href="#/directory?query=${safeId(tag.label)}">${esc(tag.label)}</a>`).join('')}</div>`:`<p class="member-hint">${esc(tr(lang,'noTags'))}</p>`}</div><form data-contribution-form="tag"><label class="member-field"><span>${esc(tr(lang,'tagLabel'))}</span><input type="text" name="label" minlength="2" maxlength="60" required placeholder="${esc(tr(lang,'tagPlaceholder'))}" ${can?'':'disabled'}><small>${esc(tr(lang,'tagHint'))}</small></label><button class="button button-outline button-small" type="submit" ${can?'':'disabled'}>${esc(tr(lang,'submitTag'))}</button></form><p class="member-hint">${esc(tr(lang,'publicTags'))}</p><p class="member-ranking-note">${esc(tr(lang,'ratingRank'))}</p><a class="member-claim-link" href="#/source-workspace?claim=${safeId(slug)}">${i('source')}${esc(tr(lang,info?.managed?'sourceWorkspace':'claimSource'))}${i('arrow')}</a>`;
}

export function renderContributionWidget(source,{lang='en'}={}) {
  return `<section class="member-contribution" data-contribution-source="${esc(sourceSlug(source))}">${contributionContent(source,lang)}</section>`;
}

export function bindContributionWidgets({root=globalThis.document,lang='en',sources=[],onChange=()=>{}}={}) {
  root.querySelectorAll('[data-contribution-source]').forEach(host=>{
    if(host.dataset.contributionBound) return;host.dataset.contributionBound='true';
    const slug=host.dataset.contributionSource, source=sourceFor(sources,slug) || {id:slug};
    const refresh=()=>{if(host.isConnected) host.innerHTML=contributionContent(source,lang);};
    const load=async()=>{state.communities.set(slug,await api(`/sources/${safeId(slug)}/community`));};
    initialiseMembers().then(async()=>{try{await load();}catch{/* The source remains browsable when contributions are unavailable. */}refresh();});
    host.addEventListener('submit',async event=>{
      const form=event.target.closest('[data-contribution-form]');if(!form) return;event.preventDefault();
      if(!canWrite()) {showMessage(host,tr(lang,state.status?.configured?'signInRequired':'setupShort'),true);return;}
      const buttons=[...form.querySelectorAll('button')];buttons.forEach(button=>button.disabled=true);
      try {
        const data=new FormData(form);
        if(form.dataset.contributionForm==='rating') {
          const stars=normaliseRating(data.get('rating'));if(stars===null) {showMessage(host,tr(lang,'ratingMissing'),true);return;}
          await api(`/sources/${safeId(slug)}/rating`,{method:'PUT',body:{stars}});await load();refresh();showMessage(host,tr(lang,'ratingSaved'));onChange();
        } else {
          await api(`/sources/${safeId(slug)}/tags`,{method:'POST',body:{label:String(data.get('label') || '').trim()}});form.reset();showMessage(host,tr(lang,'tagSubmitted'));
        }
      } catch(error){showMessage(host,errorText(lang,error),true);}finally{buttons.forEach(button=>button.disabled=false);}
    });
    host.addEventListener('click',async event=>{
      if(!event.target.closest('[data-contribution-action="remove-rating"]')) return;
      try{await api(`/sources/${safeId(slug)}/rating`,{method:'DELETE',body:{}});await load();refresh();showMessage(host,tr(lang,'ratingRemoved'));onChange();}
      catch(error){showMessage(host,errorText(lang,error),true);}
    });
  });
}

Object.assign(COPY.en,{"sourceIntro": "Manage your source block after confirming an approved contact email or completing an ownership review.", "claimHint": "An exact match with the source’s approved contact email can confirm access. An organisation domain alone supports your request but needs administrator review."});

Object.assign(COPY.fr,{"sourceIntro": "Gérez votre fiche après confirmation d’une adresse de contact approuvée ou examen de votre demande.", "claimHint": "La correspondance exacte avec une adresse de contact approuvée peut confirmer l’accès. Le domaine institutionnel seul nécessite un examen administratif."});

Object.assign(COPY.es,{"sourceIntro": "Gestione su ficha tras confirmar un correo de contacto aprobado o completar una revisión de titularidad.", "claimHint": "La coincidencia exacta con un contacto aprobado puede confirmar el acceso. El dominio institucional por sí solo requiere revisión administrativa."});
