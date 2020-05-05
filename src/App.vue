<template>
  <v-app class="grey lighten-4">
    <Navbar />
    <!--SearchBar -->
    <div>
      <v-toolbar dark app flat color="blue darken-2">
        <v-spacer />
        <v-text-field class="subtitle-1 font-weight-medium" hide-details single-line flat label="Search for Books, Authors, ISBN and Topics"
          solo-inverted
          v-model="query"></v-text-field>
        <v-btn icon v-on:click="SearchBooks">
          <v-icon>search</v-icon>
        </v-btn>
        <v-spacer />
      </v-toolbar>
    </div>
    <!--Recomendations -->
    <v-container>
      <v-row>
        <v-col cols="3">
          <v-card color="cyan darken-2" dark height="70px">
            <v-card-title class="subtitle-1" @click="Favorites">
              <v-icon large dark>favorite</v-icon>My favorites
            </v-card-title>
          </v-card>
        </v-col>

        <v-col cols="3">
          <v-card dark color="red darken-2" height="70px">
            <v-card-title class="subtitle-1" @click="Recommend">
              <v-icon large dark>person_pin</v-icon>Recomended for me
            </v-card-title>
          </v-card>
        </v-col>

        <v-col cols="3">
          <v-card dark color="blue darken" height="70px">
            <v-card-title class="subtitle-1" @click="LightRead">
              <v-icon large dark>timer</v-icon>Light Read
            </v-card-title>
          </v-card>
        </v-col>

        <v-col cols="3">
          <v-card dark color="orange darken-2" height="70px">
            <v-card-title class="subtitle-1" @click="ForgottenTreasures">
              <v-icon large dark>local_library</v-icon>Forgotten treasures
            </v-card-title>
          </v-card>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
    </v-container>
    <v-content>
      <AddBook v-bind:addBook="addBook"></AddBook>
      <ViewBook v-bind:viewBook.sync="viewBook" v-bind:bookParent="book" v-bind:user="user" ></ViewBook>
      <!--ListOfBooks -->
      <v-container>
        <v-card flat class="text-center text-light" v-if="!books.length">
          <p>Sorry. No books were found...</p>
        </v-card>

        <v-row justify="right">
          <v-col v-for="book of books" :key="book.id" cols="auto">
            <v-card flat width="320" @click="OpenBook(book)">
              <v-row class="fill-height" align="center" justify="center">
                <v-card class="fill-height mx-auto" max-width="344" outlined>
                  <v-list-item three-line>
                    <v-list-item-avatar height="140" width="95" tile color="grey">
                      <v-img v-bind:src="book.image"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <div class="body-2 mb-4 font-weight-bold">{{book.location.name}}</div>
                      <v-list-item-title class="text-wrap body-2 mb-4">{{book.title}}</v-list-item-title>
                      <v-list-item-subtitle>{{book.authors.name}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Navbar from "@/components/Navbar";
import ViewBook from "@/components/ViewBook";
import AddBook from "@/components/AddBook";
import Book from "@/services/books";

export default {
  name: "App",
  components: { Navbar, ViewBook, AddBook },
  data: () => ({
    viewBook: false,
    addBook: false,
    query: "",
    book: {
      isbn: "",
      title: "",
      pages: "",
      image: "",
      authors: [{ name: "" }],
      location: {
        id: 0,
        name: ""
      }
    },
    books: {}
  }),
  watch: {
    viewBook() {
      if (!this.viewBook) {
        this.SearchBooks();
      }
    }
  },
  methods: {
    SearchBooks() {
      Book.list(this.query)
        .then(response => {
          this.books = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    OpenBook: function(book) {
      this.viewBook = true;
      this.book = book;
    },
    LightRead() {
      Book.listLessThanPages(120)
        .then(response => {
          this.books = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    Recommend() {
      Book.recommend(this.user.id)
        .then(response => {
          this.books = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    ForgottenTreasures() {
      Book.notViewdFrequently()
        .then(response => {
          this.books = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    Favorites() {
      Book.favorites(this.user.id)
        .then(response => {
          this.books = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
             
  }
};
</script>
