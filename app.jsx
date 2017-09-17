var RecipeCard = React.createClass({

	handleEditClick: function() {
		this.props.editRecipe(this.props.recipe, false);
	},
		
	handleDeleteClick: function() {
		this.props.deleteRecipe(this.props.recipe);
	},
		
	render: function() {
		var recipe = this.props.recipe;
		return (
			<div className="panel-group">
				<div className="panel panel-default">
					<div className="panel-heading">
						<h4 className="panel-title">
							<a data-toggle="collapse" href={"#" + recipe.key}>{recipe.name}</a>
						</h4>
					</div>
					<div id={recipe.key} className="panel-collapse collapse">
						<div className="panel-body">{recipe.ingredients}</div>
						<div className="panel-body">{recipe.method}</div>
						<div className="panel-footer">
							<button onClick={this.handleEditClick}>Edit</button>
							<button onClick={this.handleDeleteClick}>Delete</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

var RecipeForm = React.createClass({

	updateRecipes: function() {
		this.props.recipe.name = this.refs.name.getValue();
		this.props.recipe.ingredients = this.refs.ingredients.getValue();
		this.props.recipe.method = this.refs.method.getValue();
		this.props.updateRecipes(this.props.recipe);
	},

	render: function() {
		var Modal = ReactBootstrap.Modal;
		var Input = ReactBootstrap.Input;
		var title = (this.props.isAddRecipe ? "Add" : "Modify") + " Recipe";
		var recipe = this.props.recipe;
		return (
			<div>
				<Modal show={this.props.showModal} onHide={this.props.hideModal}>
				<Modal.Header closeButton>
					<Modal.Title>{title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
		            <form>
		              <Input ref="name" type="text" label="Name"
		              	placeholder="Name" defaultValue={recipe.name} />
		              <Input ref="ingredients" type="textarea" label="Ingredients"
		              	placeholder="Ingredients" defaultValue={recipe.ingredients} />
		              <Input ref="method" type="textarea" label="Method"
		              	placeholder="Method" defaultValue={recipe.method} />
		            </form>
				</Modal.Body>
				<Modal.Footer>
					<button onClick={this.updateRecipes}>OK</button>
				</Modal.Footer>
				</Modal>
			</div>
		);
	}
});

var RecipeBox = React.createClass({

	getInitialState: function() {
		return JSON.parse(localStorage.getItem('tnyjhnsn_recipes')) ||
			{recipes: initialRecipes, showModal: false, selectedRecipe: "", isAddRecipe: true};
	},

	componentDidMount: function() {
		localStorage.setItem('tnyjhnsn_recipes', JSON.stringify(this.state));
	},

	handleAddClick: function() {
		this.editRecipe(new Recipe(guid()), true);
	},

	deleteRecipe: function(recipe) {
		var newRecipes = this.state.recipes.filter(function(r) {
			return r != recipe;
		})
		this.setState({recipes: newRecipes});
	},

	editRecipe: function(recipe, isAddRecipe) {
		this.setState({selectedRecipe: recipe, isAddRecipe: isAddRecipe, showModal: true});
	},

	hideModal: function() {
		this.setState({showModal: false});
	},

	updateRecipes: function(recipe) {
		if (!this.state.recipes.includes(recipe)) {
			this.state.recipes.push(recipe);
		}
		this.setState({recipes: this.state.recipes, showModal: false});
	},

	componentDidUpdate: function(prevProps, prevState) {
		localStorage.setItem('tnyjhnsn_recipes', JSON.stringify(this.state));
	},

	render: function() {
		var cards = this.state.recipes.map(function(recipe) {
			return <RecipeCard recipe={recipe}
		 		editRecipe={this.editRecipe}
		 		deleteRecipe={this.deleteRecipe} />
		}.bind(this));
		return (
			<div>
				<h3>e v i l &nbsp; s p i r it s</h3>
				<h2>A Collection of wicked cocktail recipes</h2>
				{cards}
				<button onClick={this.handleAddClick}>
					Add Recipe
				</button>
				<RecipeForm showModal={this.state.showModal}
					recipe={this.state.selectedRecipe}
					isAddRecipe={this.state.isAddRecipe}
					hideModal={this.hideModal}
					updateRecipes={this.updateRecipes} />
			</div>
		);
	}
});

var Recipe = function(key, name, ingredients, method) {
	this.key = key;
	this.name = name;
	this.ingredients = ingredients;
	this.method = method;
}

var initialRecipes = [
	new Recipe(guid(), "Dry Martini", "1 oz. dry vermouth, 4 oz. gin", "Shake over cracked ice"),
	new Recipe(guid(), "Daiquiri", "3 parts Bacardi Carta Blanco, 1 part lime juice, 2 tsp sugar, Cubed ice",
		"Add the lime and sugar to your cocktail shaker and stir until the sugar dissolves. Put lots of ice and the remaining ingredients into the shaker and shake hard for about 30 seconds to chill and dilute the mix. Strain into the glass."),
	new Recipe(guid(), "Mojito", "2 parts Bacardi Carta Blanca, 1/2 fresh lime, 12 fresh mint leaves 2 heaped bar spoons of caster sugar, Dash of soda water, Cubed ice, Crushed ice.", "Half fill the glass with crushed ice and pour in the mix.")
		]

// http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function guid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	});
}

ReactDOM.render(<RecipeBox />, document.getElementById('recipe-box'));
