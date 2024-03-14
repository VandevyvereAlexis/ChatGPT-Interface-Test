
// Cette variable stocke la clé API d'OpenIA
const apikey = '';

// Cette variable stocke l'historique de la conversation entre l'utilisateur et l'IA.
let conversation = [];



// Cette fonction est appelée lorsqu'un utilisateur soumet une question via un formulaire.
// async: Cette fonction est asynchrone, ce qui signifie qu'elle peut exécuter des opérations asynchrones telles que les requêtes réseau sans bloquer l'exécution du reste du code.
// (form): La fonction prend un argument form, qui est une référence à un formulaire HTML.
const formQuestion = async (form) => {

    // Cette ligne crée un objet message contenant le rôle (user dans ce cas) et le contenu de la question de l'utilisateur, qui est obtenu à partir de la valeur du champ de texte (input) du formulaire.
    const message = {role: 'user', content: form.messageinput.value};

    // Le message est ajouté à la variable conversation, stockant ainsi l'historique des échanges.
    conversation.push(message);

    // Cette ligne appelle la fonction addMessage pour afficher visuellement le message de l'utilisateur dans l'interface utilisateur.
    addMessage(message.role, message.content);

    // Cette ligne envoie une requête HTTP POST à l'API OpenAI pour obtenir une réponse à la question de l'utilisateur.
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apikey}`,    
            'Content-Type': 'application/json',     
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo', 
            messages: conversation, 
        }),
    });

    // Cette ligne récupère la réponse de l'API sous forme de JSON.
    const formatted = await response.json();

    // La réponse de l'IA est ajoutée à la variable conversation, continuant ainsi l'historique des échanges.
    conversation.push(formatted.choices[0].message);

    // Cette ligne appelle la fonction addMessage pour afficher visuellement la réponse de l'IA dans l'interface utilisateur. Elle utilise les données renvoyées par l'API pour déterminer le rôle du message (user ou assistant) ainsi que son contenu.
    addMessage(formatted.choices[0].message.role, formatted.choices[0].message.content);

    // Cette ligne stocke l'ensemble de la conversation dans le stockage local du navigateur. Avant de stocker la conversation, elle la transforme en chaîne JSON à l'aide de JSON.stringify() pour la rendre persistante même après la fermeture de la fenêtre du navigateur.
    localStorage.setItem('conversation', JSON.stringify(conversation));
};
// En résumé, la fonction formQuestion gère le processus d'envoi d'une question de l'utilisateur à l'API OpenAI et l'affichage de la réponse de l'IA dans l'interface utilisateur. Elle crée un message utilisateur, l'ajoute à l'historique de la conversation, envoie une requête à l'API, récupère et ajoute la réponse de l'IA à l'historique de la conversation, puis affiche visuellement les messages de l'utilisateur et de l'IA dans l'interface utilisateur. Enfin, elle stocke l'ensemble de la conversation dans le stockage local du navigateur pour une utilisation future.





// Cette fonction est appelée pour démarrer une nouvelle conversation. Elle effectue plusieurs actions pour réinitialiser l'état de la conversation.
// Déclaration de la fonction nommée newConversation sans paramètres.
const newConversation = () => {

    let conversationBox = document.getElementById("conversation");

    // Elle réinitialise la variable conversation en la vidant, ce qui efface l'historique des échanges. Cela signifie que la variable conversation ne contiendra plus aucune donnée sur les échanges précédents.
    conversation = [];

    // Elle vide également le contenu de la zone de conversation dans l'interface utilisateur en réinitialisant sa propriété innerHTML à une chaîne vide. Cela efface visuellement tous les messages affichés dans la zone de conversation.
    conversationBox.innerHTML = '';

    // Enfin, elle supprime les données de conversation stockées localement en utilisant la méthode removeItem de l'objet localStorage. Cela garantit qu'aucune trace de la conversation précédente n'est conservée dans le stockage local du navigateur.
    localStorage.removeItem('conversation');
};
// En résumé, la fonction newConversation réinitialise l'état de la conversation en vidant l'historique des échanges, en effaçant visuellement la zone de conversation dans l'interface utilisateur et en supprimant les données de conversation stockées localement. Cela permet de commencer une nouvelle conversation à partir d'un état vierge.




// Cette fonction est responsable d'ajouter un message à la zone de conversation dans l'interface utilisateur.
// La fonction prend deux paramètres : role, qui spécifie le rôle du message (user ou assistant), et content, qui est le contenu textuel du message.
const addMessage = (role, content) => {

    const conversationBox = document.getElementById("conversation");

    // Elle crée un nouvel élément HTML <p> (paragraphe) à l'aide de la méthode createElement() de l'objet document. Ce paragraphe représentera le message dans l'interface utilisateur.
    const aiMessage = document.createElement("p");

    // Elle définit le contenu textuel du paragraphe en utilisant la propriété textContent, en lui attribuant le contenu passé en argument.
    aiMessage.textContent = content; 

    // En fonction du rôle du message, elle définit la couleur du texte du paragraphe. Si le rôle est "user", le texte sera blanc ; si le rôle est "assistant", le texte sera rouge.
    aiMessage.style.color = role === "user" ? "white" : role === "assistant" && "red";

    // Enfin, elle ajoute le paragraphe contenant le message à la fin de la zone de conversation dans l'interface utilisateur en utilisant la méthode appendChild() de l'élément conversationBox.
    conversationBox.appendChild(aiMessage);
};
// n résumé, la fonction addMessage crée un nouvel élément HTML <p> pour représenter un message dans l'interface utilisateur, définit son contenu textuel et sa couleur en fonction du rôle du message, puis l'ajoute à la zone de conversation dans l'interface utilisateur. Cela permet d'afficher les messages de la conversation de manière appropriée.




const init = () => {

    const oldConversation = localStorage.getItem('conversation');

    if (oldConversation) {
        const formatted = JSON.parse(oldConversation);
        conversation = formatted;

        for (let index = 0; index < conversation.length; index++) {
            addMessage(conversation[index].role, conversation[index].content);
        }
    }
}
init();





