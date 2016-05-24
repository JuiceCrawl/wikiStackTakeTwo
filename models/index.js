var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistacktwo',{
  logging: false
});

var Page = db.define('page', {
  title: {
      type: Sequelize.STRING,
      allowNull: false
  },
  urlTitle: {
      type: Sequelize.STRING,
      allowNull: false,
  },
  content: {
      type: Sequelize.TEXT,
      allowNull: false
  },
  status: {
      type: Sequelize.ENUM('open', 'closed')
  },
  date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
  }
},{
    getterMethods: {
      route: function(){
        return '/wiki/' + this.urlTitle;
      },
      renderedContent: function () {
            return marked(this.content);
        }

    },
    classMethods: {
      findByTag: function (tag) {
            return this.findAll({
                where: {
                    tags: {
                        $contains: [tag]
                    }
                }
            });
        }
    },
    instanceMethods: {
      findSimilar: function () {
            return Page.findAll({
                where: {
                    id: {
                        $ne: this.id
                    },
                    tags: {
                        $overlap: this.tags
                    }
                }
            });
        }
    },
    hooks: {
      beforeValidate: function (page) {
        if (page.title) {
            page.urlTitle = page.title.replace(/\s/g, '_').replace(/\W/g, '');
        } else {
            page.urlTitle = Math.random().toString(36).substring(2, 7);
        }
      }
    },
});

var User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        isEmail: true,
        allowNull: false
    }
});

Page.belongsTo(User, {
    as: 'author'
});

module.exports = {
  Page: Page,
  User: User
};

